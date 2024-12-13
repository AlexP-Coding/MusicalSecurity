Vagrant.configure("2") do |config|

    # Defining machine-agnostic details
    config.vm.box = "generic/alpine317"
    config.vm.synced_folder "./bootstrap/", "/bootstrap/"
    config.vm.provider :virtualbox do |vb|
        vb.memory = "1024"
    end

    # Defining Forwarder machine rules
    config.vm.define "fwd" do |fwd|
        fwd.vm.hostname = "fwd.local"

        # Allowing Forwarder to be included in both networks (internal + DMZ)
        fwd.vm.network "private_network", ip: "192.168.1.30",
            virtualbox__intnet: "internal-network"
        fwd.vm.network "private_network", ip: "192.168.2.10",
            virtualbox__intnet: "dmz"

        # Bridging the Forwarder and the host machine (host-only adapter)
        fwd.vm.network "private_network", ip: "192.168.56.10", :adapter => 4
        
        # Allowing the Forwarder to access the internet
        fwd.vm.provider :virtualbox do |vb|
            vb.name = "musicmarkt-fwd"
            vb.customize ["modifyvm", :id, "--nic5", "nat"]
        end

        # Provisioning Forwarder
        fwd.vm.provision "shell", path: "bootstrap/forwarder/init.sh"

    end

    # Defining Database machine rules
    config.vm.define "db" do |db|
        db.vm.hostname = "db.local"

        # Adding backend folder to the Database-server
        db.vm.synced_folder "./backend/", "/app/backend"

        # Allowing Database-server to be included in the internal network
        db.vm.network "private_network", ip: "192.168.1.10",
            virtualbox__intnet: "internal-network"        
        db.vm.provider :virtualbox do |vb|
            vb.name = "musicmarkt-db"
        end

        # Provisioning Database-server
        db.vm.provision "shell", path: "bootstrap/database-server/init.sh"
        
    end

    # Defining API machine rules
    config.vm.define "api" do |api|
        api.vm.hostname = "api.local"

        # Adding backend folder to the API-server
        api.vm.synced_folder "./backend/", "/app/backend"
        
        #  Allowing API-server to be included in the internal network
        api.vm.network "private_network", ip: "192.168.1.20",
            virtualbox__intnet: "internal-network"
        api.vm.provider :virtualbox do |vb|
            vb.name = "musicmarkt-api"
        end

        # Provisioning API-server
        api.vm.provision "shell", path: "bootstrap/api-server/init.sh"

    end

    # Defining Web-server machine rules
    config.vm.define "web" do |web|
        web.vm.hostname = "web.local"

        # Adding frontend folder to the Web-server
        web.vm.synced_folder "./frontend/", "/app/frontend"

        # Allowing Web-server to be included in the DMZ network
        web.vm.network "private_network", ip: "192.168.2.20",
        virtualbox__intnet: "dmz"
        web.vm.provider :virtualbox do |vb|
            vb.name = "musicmarkt-web"
        end

        # Provisioning Web-server
        web.vm.provision "shell", path: "bootstrap/web-server/init.sh"

    end

    # Making components aware of each-other
    # Note: This does not bypass and firewall rules or the subnet topology. 
    # e.g. web-server & fwd don't have direct access to the database-server  
    # even if there's an /etc/hosts entry for it. This is merely a  way to  
    # avoid having to individually embed this information in each machine.

    config.vm.provision "shell", 
        inline: "cat /bootstrap/hosts | sudo tee -a /etc/hosts >/dev/null"

    
end


