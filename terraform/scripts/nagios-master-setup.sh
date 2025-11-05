#!/bin/bash
set -e

# Nagios Master Setup Script for Ubuntu 22.04
# This script sets up Nagios Core with monitoring for Puppet infrastructure

# Variables from Terraform
PUPPET_MASTER_IP="${puppet_master_ip}"
FRONTEND_IP="${frontend_ip}"
BACKEND_IP="${backend_ip}"
LOG_FILE="/var/log/nagios-master-setup.log"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Update system
update_system() {
    log "Updating system packages..."
    apt update -y
    apt upgrade -y
    apt install -y curl wget unzip software-properties-common
}

# Install Apache and PHP
install_apache() {
    log "Installing Apache and PHP..."
    apt install -y apache2 php libapache2-mod-php php-gd
    systemctl enable apache2
    systemctl start apache2
}

# Install Nagios Core
install_nagios() {
    log "Installing Nagios Core..."
    
    # Install dependencies
    apt install -y build-essential unzip openssl libssl-dev
    
    # Create nagios user and group
    useradd -m -s /bin/bash nagios
    groupadd nagcmd
    usermod -a -G nagcmd nagios
    usermod -a -G nagcmd www-data
    
    # Download and compile Nagios Core
    cd /tmp
    wget https://github.com/NagiosEnterprises/nagioscore/archive/nagios-4.4.14.tar.gz
    tar xzf nagios-4.4.14.tar.gz
    cd nagioscore-nagios-4.4.14/
    
    ./configure --with-command-group=nagcmd
    make all
    make install
    make install-commandmode
    make install-init
    make install-config
    make install-webconf
    
    # Copy eventhandlers
    cp -R contrib/eventhandlers/ /usr/local/nagios/libexec/
    chown -R nagios:nagios /usr/local/nagios/libexec/eventhandlers
    
    log "Nagios Core installation completed"
}

# Install Nagios Plugins
install_nagios_plugins() {
    log "Installing Nagios Plugins..."
    
    cd /tmp
    wget https://github.com/nagios-plugins/nagios-plugins/archive/release-2.4.6.tar.gz
    tar xzf release-2.4.6.tar.gz
    cd nagios-plugins-release-2.4.6/
    
    ./tools/setup
    ./configure
    make
    make install
    
    log "Nagios Plugins installation completed"
}

# Install NRPE
install_nrpe() {
    log "Installing NRPE..."
    
    cd /tmp
    wget https://github.com/NagiosEnterprises/nrpe/releases/download/nrpe-4.1.0/nrpe-4.1.0.tar.gz
    tar xzf nrpe-4.1.0.tar.gz
    cd nrpe-4.1.0/
    
    ./configure --enable-command-args
    make all
    make install
    make install-config
    
    log "NRPE installation completed"
}

# Configure Nagios web interface
configure_nagios_web() {
    log "Configuring Nagios web interface..."
    
    # Generate random password
    NAGIOS_PASSWORD=$(openssl rand -base64 12)
    echo "$NAGIOS_PASSWORD" > /tmp/nagios-password.txt
    chmod 600 /tmp/nagios-password.txt
    
    # Create nagiosadmin user
    htpasswd -cb /usr/local/nagios/etc/htpasswd.users nagiosadmin "$NAGIOS_PASSWORD"
    
    # Enable Apache modules
    a2enmod rewrite
    a2enmod cgi
    
    # Restart Apache
    systemctl restart apache2
    
    log "Nagios web interface configured with password: $NAGIOS_PASSWORD"
}

# Configure Nagios monitoring
configure_monitoring() {
    log "Configuring Nagios monitoring for infrastructure..."
    
    # Create hosts configuration
    cat > /usr/local/nagios/etc/objects/hosts.cfg << EOF
# Puppet Master Host
define host {
    use                     linux-server
    host_name               puppet-master
    alias                   Puppet Master Server
    address                 $PUPPET_MASTER_IP
    max_check_attempts      5
    check_period            24x7
    notification_interval   30
    notification_period     24x7
}

# Frontend Host
define host {
    use                     linux-server
    host_name               frontend-server
    alias                   Frontend Application Server
    address                 $FRONTEND_IP
    max_check_attempts      5
    check_period            24x7
    notification_interval   30
    notification_period     24x7
}

# Backend Host
define host {
    use                     linux-server
    host_name               backend-server
    alias                   Backend Application Server
    address                 $BACKEND_IP
    max_check_attempts      5
    check_period            24x7
    notification_interval   30
    notification_period     24x7
}
EOF

    # Create services configuration
    cat > /usr/local/nagios/etc/objects/services.cfg << EOF
# Puppet Master Services
define service {
    use                     generic-service
    host_name               puppet-master
    service_description     PING
    check_command           check_ping!100.0,20%!500.0,60%
}

define service {
    use                     generic-service
    host_name               puppet-master
    service_description     SSH
    check_command           check_ssh
}

define service {
    use                     generic-service
    host_name               puppet-master
    service_description     Puppet Server Port
    check_command           check_tcp!8140
}

# Frontend Services
define service {
    use                     generic-service
    host_name               frontend-server
    service_description     PING
    check_command           check_ping!100.0,20%!500.0,60%
}

define service {
    use                     generic-service
    host_name               frontend-server
    service_description     SSH
    check_command           check_ssh
}

define service {
    use                     generic-service
    host_name               frontend-server
    service_description     Frontend HTTP
    check_command           check_http_port!3000
}

# Backend Services
define service {
    use                     generic-service
    host_name               backend-server
    service_description     PING
    check_command           check_ping!100.0,20%!500.0,60%
}

define service {
    use                     generic-service
    host_name               backend-server
    service_description     SSH
    check_command           check_ssh
}

define service {
    use                     generic-service
    host_name               backend-server
    service_description     Backend HTTP
    check_command           check_http_port!8080
}
EOF

    # Add custom commands
    cat >> /usr/local/nagios/etc/objects/commands.cfg << EOF

# Custom HTTP port check command
define command {
    command_name    check_http_port
    command_line    \$USER1\$/check_http -H \$HOSTADDRESS\$ -p \$ARG1\$
}
EOF

    # Update main configuration to include new files
    sed -i '/^cfg_file=.*objects\/localhost.cfg/a cfg_file=/usr/local/nagios/etc/objects/hosts.cfg' /usr/local/nagios/etc/nagios.cfg
    sed -i '/^cfg_file=.*objects\/hosts.cfg/a cfg_file=/usr/local/nagios/etc/objects/services.cfg' /usr/local/nagios/etc/nagios.cfg
    
    log "Nagios monitoring configuration completed"
}

# Configure email notifications (optional)
configure_notifications() {
    log "Configuring email notifications..."
    
    # Install mail utilities
    apt install -y mailutils postfix
    
    # Configure basic email settings
    cat > /usr/local/nagios/etc/objects/contacts.cfg << EOF
define contact {
    contact_name                    nagiosadmin
    use                            generic-contact
    alias                          Nagios Admin
    email                          admin@localhost
}

define contactgroup {
    contactgroup_name              admins
    alias                          Nagios Administrators
    members                        nagiosadmin
}
EOF
    
    log "Email notifications configured"
}

# Start Nagios services
start_services() {
    log "Starting Nagios services..."
    
    # Verify configuration
    /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg
    
    # Create systemd service file
    cat > /etc/systemd/system/nagios.service << EOF
[Unit]
Description=Nagios
BindTo=network.target

[Install]
WantedBy=multi-user.target

[Service]
Type=forking
User=nagios
Group=nagios
ExecStart=/usr/local/nagios/bin/nagios -d /usr/local/nagios/etc/nagios.cfg
ExecReload=/bin/kill -HUP \$MAINPID
EOF

    # Enable and start services
    systemctl daemon-reload
    systemctl enable nagios
    systemctl start nagios
    systemctl restart apache2
    
    log "Nagios services started successfully"
}

# Create monitoring dashboard info
create_dashboard_info() {
    log "Creating monitoring dashboard information..."
    
    cat > /tmp/nagios-info.txt << EOF
========================================
Nagios Monitoring Dashboard
========================================
Web Interface: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/nagios4
Username: nagiosadmin
Password: $(cat /tmp/nagios-password.txt)

Monitored Infrastructure:
- Puppet Master: $PUPPET_MASTER_IP
- Frontend Server: $FRONTEND_IP  
- Backend Server: $BACKEND_IP

Services Monitored:
- PING connectivity
- SSH access
- HTTP services (ports 3000, 8080)
- Puppet Server (port 8140)

Log Files:
- Nagios: /usr/local/nagios/var/nagios.log
- Setup: $LOG_FILE
========================================
EOF

    log "Dashboard information created at /tmp/nagios-info.txt"
}

# Main execution
main() {
    log "Starting Nagios Master setup..."
    
    update_system
    install_apache
    install_nagios
    install_nagios_plugins
    install_nrpe
    configure_nagios_web
    configure_monitoring
    configure_notifications
    start_services
    create_dashboard_info
    
    log "Nagios Master setup completed successfully!"
    
    # Display summary
    echo "========================================="
    echo "Nagios Master Setup Complete!"
    echo "========================================="
    echo "Public IP: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
    echo "Web Interface: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/nagios4"
    echo "Username: nagiosadmin"
    echo "Password: $(cat /tmp/nagios-password.txt)"
    echo ""
    echo "Monitored Hosts:"
    echo "  Puppet Master: $PUPPET_MASTER_IP"
    echo "  Frontend: $FRONTEND_IP"
    echo "  Backend: $BACKEND_IP"
    echo ""
    echo "Log file: $LOG_FILE"
    echo "Dashboard info: /tmp/nagios-info.txt"
    echo "========================================="
}

# Execute main function
main 2>&1 | tee -a "$LOG_FILE"