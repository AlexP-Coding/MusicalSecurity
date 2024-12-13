# Preface
Code featured in this repository falls within the scope of the course of Network and Computer Security @ [IST](https://tecnico.ulisboa.pt/en/) (2022/2023).

It was originally present at https://github.com/zeval/netsec/. I have created this repo so the work done may be kept for posterity in case the original repository is deleted.

This project revolves around the business context of an online music-related shop (e.g. instruments, vinyls, merchandising), which is accomplished by defining a secure network environment. Specifically, the project aims to define a secure network topology, enforce strict firewall rules, and assure only the necessary communication occurs, using the most secure communication protocols available, such as TLSv1.3.

Additionally, an IDS was implemented in order to detect any possible exfiltration of data as well as potential brute-forcing attacks, allowing us to act on them with countermeasures such as rate-limiting.

The project also features a JavaScript implementation of a time-based one-time password (TOPT) mechanism, following [RFC-6238](https://www.rfc-editor.org/rfc/rfc6238) as a secure multifactor authentication mechanism.

> **Disclaimer**: All credentials, keys and certificates used for this project are valid only in the scope of this project, maintaining no value in the real world. In a production environment, these artifacts should not be stored in a *git* repository.

Network topology is defined as follows.

```plain
 Internet       ┌─────────────────────────────────────────────────────────┐
                │ External Network/DMZ                                    │
                │                           ┌─────────────────────────┐   │
                │                           │ Internal Network        │   │
                │                           │                         │   │
┌─────────┐     │       ┌───────────┐       │     ┌────────────┐      │   │
│ Clients ├─────┼───────┤ Forwarder ├───────┼─────┤ API Server ├────┐ │   │
└─────────┘     │       └─────┬─────┘       │     └────────────┘    │ │   │
                │             │             │                       │ │   │
                │             │             │                       │ │   │
                │       ┌─────┴──────┐      │   ┌─────────────────┐ │ │   │
                │       │ Web Server │      │   │ Database Server ├─┘ │   │
                │       └────────────┘      │   └─────────────────┘   │   │
                │                           │                         │   │
                │                           └─────────────────────────┘   │
                │                                                         │
                └─────────────────────────────────────────────────────────┘
```

## Setup
### Testing platform
The recommended testing platform is amd64 Ubuntu 20.04 LTS. It's also stable under macOS Ventura 13.0. Windows should be avoided as it isn't entirely compatible with vagrant.

### Dependencies
For a swift, minimal-setup startup, our platform makes use of [Vagrant](https://www.vagrantup.com/), using [VirtualBox](https://www.virtualbox.org/) as a provider. Make sure you have both of these packages installed before proceeding.

#### Debian-based
```bash
sudo apt install virtualbox vagrant
```

### Platform details
Feel free to inspect our *Vagrantfile*. We make use of lightweight [Alpine Linux](https://www.alpinelinux.org/) images, using the latest [Alpine Linux 3.17 Box](https://app.vagrantup.com/generic/boxes/alpine317), in order to only include in each machine the tools we *really* need.

We've reserved 1GB of memory for each machine, that makes a total of 4GB required (WCS)

### Getting started, hello_w0rld
Ready... set... go! Once everything's installed, simply run `vagrant up` and you should see all the required machines booting up.
  * The required *Vagrant* box will be downloaded, and the machines which compose the *MusicMarkt* platform will download their required dependencies without requiring any additional input (go grab some popcorn).

*Vagrant* is only a tool for orchestration, it is set to use VirtualBox as a default provider, meaning that's the hypervisor being used. You can follow-up by opening VirtualBox and seeing the newly launched virtual machines running in *background* mode. 

If you so choose, you can click *Show* on VirtualBox to enter and control a given VM. 

Each VM has an initial moment of provisioning, be it for firewall configuration, database bootstrapping or any other boot-time requirement, so you should wait until `vagrant up` instruction finishes before before interacting with the platform.

#### Next steps
From the moment `vagrant up` finishes, you're free to explore the platform. 

Access it via [musicmarkt.local](https://musicmarkt.local) on your browser.
- In order to fully make use of HTTPS, add our [CA root certificate](bootstrap/ca/server.crt) as a trusted certificate on your system.
  - You can check-out more detailed instructions on how to do this under [📚 Setting up HTTPS development of the API](docs/development.md).
- The API is also available under [api-musicmarkt.local](https://api-musicmarkt.local).

### Notes
#### General
* This project makes use of the mDNS broadcasting feature in order to make it's local domains ([musicmarkt.local](https://musicmarkt.local) and [api-musicmarkt.local](https://api-musicmarkt.local)) known to the host machine, given that they're hosted on the guest VMs which compose the platform. This way, the *forwarder* machine continuously broadcasts these domains as a pointer to `192.168.56.10`, the *forwarder*'s host-only adapter address. 
  * This practice is accomplished by the use of the [Avahi](https://avahi.org/) project.
* [Caddy](https://caddyserver.com/) is then used (on the *forwarder* machine) as a reverse-proxy which can either send requests to the API or the website by analyzing the requested host. 
* Every existing edge between each machine in the platform is protected by HTTPS. 
#### OTP
* Our project makes use of cryptographically-strong random numbers supplied by the [nanoid](https://www.npmjs.com/package/nanoid) project in the initial process of OTP generation.
* The OTP-side of this project follows [RFC-6238](https://www.rfc-editor.org/rfc/rfc6238) to the letter.


### Documentation
* Looking for our API docs? You can find most logic detailed in the [📖 API Documentation](docs/api.md).
* If you're looking to start the API in development mode, checkout [📚 Setting up HTTPS development of the API](docs/development.md).
### Troubleshooting
- If you’re on linux and having issues, maybe your device isn’t capable of receiving mDNS, in that case:
    - `sudo apt install libnss-mdns`
    - In case this doesn’t work, hard-code it at `/etc/hosts`, as such:
        
        ```plain
        # MusicMarkt G46
        192.168.56.10 api-musicmarkt.local musicmarkt.local
        ```
        
- If you’re also going to interact with the platform via ways other than the browser, you can add the root CA certificate to the system’s truststore
  - ```
    sudo cp ./bootstrap/ca/server.crt /usr/local/share/ca-certificates
    sudo update-ca-certificates
      ```
- Looking to restart the entire system but don’t wanna lose persistence? The recommended course of action is to destroy and recreate every machine except the database
    ```jsx
    vagrant destroy fwd api web;
    vagrant up;
    ```
- If you want to install additional dependencies on the forwarder after launch, you need to allow it to access the internet. You can always flush the forwarder’s output rules, though we’ve already included useful dependencies such as `tcpdump` and `tshark` for network analysis.

### Authors
* Alexandra Pato (ist97375) @ [AlexP-Coding](https://github.com/AlexP-Coding)
* Julliana Sousa (ist105727) @ [AlexP-Coding](https://github.com/jullianasousa)
* José Almeida (ist105793) @ [zeval](https://github.com/zeval)