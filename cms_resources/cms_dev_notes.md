## Create a new VM instance

Creating a new instance

Log in to the Google Cloud account.

Malariagen Analytics project
Compute Engine > VM instances

Zone europe-west1-d
Create instance > 
name: wp
region: europe-west1
zone: europe-west1-d
Machine type: micro 1 shared vCPU, 0.6 GB
Ubuntu 18.04 LTS
10 GB


Note from the future: if you want to upload backups to the cloud, 
you will need the `Storage` `Read and Write` Cloud API access scope.
rather than `Allow default access`.
Changing this later will `You must stop the VM instance to edit its API access scopes`.
Stop the VM > Edit > Access scopes: Set access for each API > Storage: Read Write.
Start the VM.


Note: We can copy the equivalent CLI command from the cloud console utility.
I won't paste it here, because I'm not sure about the security.


Press Create


If you try to connect and receive:
```
Connection Failed
We are unable to connect to the VM on port 22. Learn more about possible causes of this issue.
```
...you might just need to wait!

To check the boot status without SSH, it might help to 
VM instances > vm (wp) > Details > Logs > Serial port 1 (console)
In the past, it has taken a while to get past this step (but eventually does, < 1hr).
```
Starting Initial cloud-init job (metadata service crawler)...
```
To restore from snapshot, see `cms_backup_resources/wp_backup_dev_notes.md`.



Estimated Cost
$4.79 per month (£3.63)


## Create swap space (by KK)

Guide
https://support.rackspace.com/how-to/create-a-linux-swap-file/

Cloud console > hamburger menu > Compute Engine
VM instances > wp > SSH > Open in browser window.

```
sudo su
df -h
cd /
free
fallocate -l 1G swapfile
mkswap swapfile 
swapon swapfile 
chmod 0600 swapfile 
swapon swapfile 
rm swapfile 
swapon -s
```

## Obtain a Static IP

Cloud console > hamburger menu > Networking > VPC network > External IP addresses

For the VM instance (wp), change the type "Ephemeral" to "static" and give it a name, e.g. "analytics-wp" 
(Press Reserve)

Note https://cloud.google.com/compute/pricing
```
If you reserve a static external IP address but do not use it, you will be charged for the IP address according to the table below. If you reserve a static external IP address and use it with a Compute Engine resource, such as VM instance or a forwarding rule, the address is considered in use and you will not be charged for it.
```


## Install Nginx and MariaDB

Cloud console > hamburger menu > Compute Engine
VM instances > wp > SSH > Open in browser window.

```
sudo su
apt update && apt upgrade -y
apt install nginx -y
nginx -v
```

nginx version: nginx/1.14.0 (Ubuntu)

```
apt install mariadb-server -y
mysql
```

Server version: 10.1.29-MariaDB-6 Ubuntu 18.04

```
mysql_secure_installation
```

  [Enter current password for root (enter for none): We've just installed MariaDB so the password will be blank, so press enter]
  [You will get "Error 1698 (28000): Access denied for 'root'@'localhost'" if you haven't sudo'd]  
  [Set root password? [Y/n] Y]
  [Saved root password in Password Safe]
  [Remove anonymous users? [Y/n] Y]
  [Disallow root login remotely? [Y/n] Y]
  [Remove test database and access to it? [Y/n] Y]
  [Reload privilege tables now? [Y/n] Y]


## Install PHP modules

What are the required modules?

https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-ubuntu-18-04
```
Since Nginx does not contain native PHP processing like some other web servers, you will need to install php-fpm, which stands for "fastCGI process manager". We will tell Nginx to pass PHP requests to this software for processing.
```

https://deliciousbrains.com/php-curl-how-wordpress-makes-http-requests/
```
Internally, WordPress uses the WP_Http class for network requests, which in turn relies on the Requests library. This means that all of the HTTP utility methods like wp_remote_get() and wp_remote_post() use Requests. At a high level, WordPress updates, plugin downloads, plugin updates, and pretty much any upload/download functionality in WordPress core is using the Requests abstraction of the cURL bindings and options.
```

http://www.zoopable.com/check-php-gd-library-installed-or-not/
```
Many web scripts and web based software that are related to image generation and manipulation, depend upon the PHP GD library to work. PHP GD is the standard image processing library in php. For instance, WordPress will not be able to resize images to create thumbnails if PHP GD is not installed on your web server.
```

https://www.fidosysop.org/3896/04/php-mbstring-may-need-enabling/
```
PHP Multibyte String often referred to as MBstring may not be enabled in many common php configurations, but may be needed in certain WordPress configurations, dependent on certain plugin use.
[...]
mbstring provides multibyte specific string functions that help you deal with multibyte encodings in PHP. In addition to that, mbstring handles character encoding conversion between the possible encoding pairs. mbstring is designed to handle Unicode-based encodings such as UTF-8 and UCS-2 and many single-byte encodings for convenience.
```

https://www.wordfence.com/blog/2015/10/should-you-disable-xml-rpc-on-wordpress/
```
This entry was posted in WordPress Security on October 12, 2015
[...]

To us, disabling XML-RPC comes with a cost. You are disabling a major API in WordPress. We briefly provided this capability, but removed the feature because WordPress’s own API abuse prevention has improved. Furthermore, providing the ability to disable XML-RPC caused confusion among users when their applications broke because they could not access the API.
```

```
apt install php-fpm php-curl php-mysql php-gd php-mbstring php-xml php-xmlrpc -y
php -v
```
PHP 7.2.7-0ubuntu0.18.04.1 (cli) (built: Jul  3 2018 15:16:52) ( NTS )

To see PHP modules and their versions:
```
php -r 'foreach (get_loaded_extensions() as $extension) echo "$extension: " . phpversion($extension) . "\n";'
```


## Configure Nginx

### cgi.fix_pathinfo

https://stackoverflow.com/questions/32797319/whats-wrong-with-having-cgi-fix-pathinfo-0
```
Are you running php-cgi anyway? It's somewhat unlikely that nginx is used with anything but php-fpm. Therefore setting this to 1 is obviously not what you wanted. – mario Sep 26 '15 at 12:52
Yep, i'm running php-fpm. Can you elaborate? – x-yuri Sep 26 '15 at 12:59

FPM is not CGI. And the fix_pathinfo flag is only meant to correct the CGI environment under Apache. – mario Sep 26 '15 at 13:00 
Can you give even more info? Was this flag added specifically for apache, or specifically for CGI, or for apache + php module? What exactly happens with 0, and with 1? Which variables are affected? Can you provide an example of what it did for apache/CGI, and an example of what bad it does for nginx + php-fpm? – x-yuri Sep 26 '15 at 14:58

Is the PHP option 'cgi.fix_pathinfo' really dangerous with Nginx + PHP-FPM? – mario Sep 26 '15 at 15:19
```

https://serverfault.com/questions/627903/is-the-php-option-cgi-fix-pathinfo-really-dangerous-with-nginx-php-fpm
```
There has been a lot of talking about a security issue relative to the cgi.fix_pathinfo PHP option used with Nginx (usually PHP-FPM, fast CGI).

As a result, the default nginx configuration file used to say:

# NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
However, now, the "official" Nginx wiki states that PATH_INFO can be handled correctly without disabling the above PHP option. So what?
[...]
However, the best solution is to just make sure PHP-FPM is configured correctly so that it will never execute a file unless it ends with ".php". It's worth noting that recent versions of PHP-FPM (~5.3.9+?) have this as default, so this danger isn't so much problem any more.
```

https://www.nginx.com/resources/wiki/start/topics/examples/phpfcgi/
```
The if lets NGINX check whether the *.php does indeed exist to prevent NGINX to feeding PHP FPM non php script file (like uploaded image).
[...]
This guide run fine on php.ini with cgi.fix_pathinfo = 1 (the default).
Some guide insist to change it to cgi.fix_pathinfo = 0 but doing that make PHP_SELF variable broken (not equal to DOCUMENT_URI).
```

/etc/php/7.2/fpm/php.ini
```
; cgi.fix_pathinfo provides *real* PATH_INFO/PATH_TRANSLATED support for CGI.  PHP's
; previous behaviour was to set PATH_TRANSLATED to SCRIPT_FILENAME, and to not grok
; what PATH_INFO is.  For more information on PATH_INFO, see the cgi specs.  Setting
; this to 1 will cause PHP CGI to fix its paths to conform to the spec.  A setting
; of zero causes PHP to behave as before.  Default is 1.  You should fix your scripts
; to use SCRIPT_FILENAME rather than PATH_TRANSLATED.
; http://php.net/cgi.fix-pathinfo
;cgi.fix_pathinfo=1

```


### Set up the Nginx site

/etc/nginx/sites-available/default
```
# In most cases, administrators will remove this file from sites-enabled/ and
# leave it as reference inside of sites-available where it will continue to be
# updated by the nginx packaging team.
```

```
rm /etc/nginx/sites-enabled/default
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/wp
ln -s /etc/nginx/sites-available/wp /etc/nginx/sites-enabled/
nano /etc/nginx/sites-available/wp
```

#### server_name  _

http://nginx.org/en/docs/http/server_names.html
```
In catch-all server examples the strange name “_” can be seen:

server {
    listen       80  default_server;
    server_name  _;
    return       444;
}
There is nothing special about this name, it is just one of a myriad of invalid domain names which never intersect with any real name. Other invalid names like “--” and “!@#” may equally be used.
```


#### default_server


http://nginx.org/en/docs/http/request_processing.html
```
The default_server parameter has been available since version 0.8.21. In earlier versions the default parameter should be used instead.
```


#### root

/etc/nginx/sites-available/wp
```
root /var/www/wp
```

```
cp -rp /var/www/html /var/www/wp
```

#### index

/etc/nginx/sites-available/wp
```
# Add index.php to the list if you are using PHP
```
(Remove all of the others, i.e. `index index.php`.)


#### location

/etc/nginx/sites-available/wp
```
    location / {
        try_files $uri $uri/ /index.php?$args;
    }
    
    location ~ \.php$ {
         include snippets/fastcgi-php.conf;
         fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
         fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
         include fastcgi_params;
    }
```

https://www.nginx.com/resources/wiki/start/topics/recipes/wordpress/
```
If you are using a version below 0.8.30, you will want to add this to your fastcgi_params file.

 fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
```
(We shouldn't need that.)


### Summary

/etc/nginx/sites-available/wp
```

# Based on a copy of /etc/nginx/sites-enabled/default LH 2018-07-05

# WordPress server configuration
#
limit_req_zone $binary_remote_addr zone=one:10m rate=30r/m;
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        # SSL configuration
        #
        # listen 443 ssl default_server;
        # listen [::]:443 ssl default_server;
        #
        # Note: You should disable gzip for SSL traffic.
        # See: https://bugs.debian.org/773332
        #
        # Read up on ssl_ciphers to ensure a secure configuration.
        # See: https://bugs.debian.org/765782
        #
        # Self signed certs generated by the ssl-cert package
        # Don't use them in a production server!
        #
        # include snippets/snakeoil.conf;

        root /var/www/wp;

        index index.php;

        server_name _;

        location / {
                try_files $uri $uri/ /index.php?$args;
        }

        # Pass PHP scripts to FastCGI server
        #
        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        }

        # Redirect 401, 403 to 404
        error_page 401 403 404 /404.html;

        # Deny access to hidden files, e.g. .htaccess, .htpasswd
        location ~ /\. {
                deny all;
        }

        # Limit access to wp-admin
        location /wp-admin {
                allow 129.67.44.0/22; # WTCHG IP range
                allow 163.1.206.129/32; # BDI gateway
                deny all;
                limit_req zone=one; # 30 requests per minute
        }


        # Hide plugin files from the world
        location ^~ /wp-content/aiowps_backups {
                deny all;
        }
        location ^~ /wp-content/updraft {
                deny all;
        }

        # Disable XML-RPC
        location = /xmlrpc.php {
                deny all;
                access_log off;
                log_not_found off;
                return 444; # Close connection with no response
        }

        # Security headers
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
}
```


### Test the Nginx site config

```
nginx -t
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful


### Restart Nginx and PHP
```
service nginx restart
service php7.2-fpm restart
```


## Test PHP


```
rm /var/www/wp/index.nginx-debian.html
nano /var/www/wp/index.php
```

```
<?php phpinfo(); ?>
```

Visit the IP address.
PHP Version 7.2.7-0ubuntu0.18.04.1


## Install WordPress

### Create a database

```
mysql -u root -p
CREATE DATABASE wordpress;
CREATE USER `wp`@`localhost` IDENTIFIED BY 'EnterStrongPassword';
GRANT ALL ON wordpress.* TO `wp`@`localhost`;
FLUSH PRIVILEGES;
exit;
```

https://wordpress.stackexchange.com/questions/6424/mysql-database-user-which-privileges-are-needed

Note: wp is not given the GRANT OPTION.

### Download and install WordPress

```
cd /var/www/wp
wget https://wordpress.org/latest.tar.gz
tar xvf latest.tar.gz --strip-components=1
rm latest.tar.gz
chown -R www-data:www-data /var/www/wp/
chmod -R 755 /var/www/wp/
```

Visit the IP address.

Choose a language.
You should see an installation guide. Press "Let's go!"
Go through the installation.
Provide the database details.

If the chown or chmod step was not completed, then WP will say:
```
Sorry, but I can’t write the wp-config.php file.
```

Otherwise:
```
All right, sunshine! You’ve made it through this part of the installation. WordPress can now communicate with your database. If you are ready, time now to…
```

Choose to `Discourage search engines from indexing this site`


## Security

See other sections for backups, updates and passwords, etc.

### Set up fail2ban

http://jonnyreeves.co.uk/2016/wordpress-on-a-google-compute-engine-f1-micro/
```
That host was hitting me with ~12 requests per second which was enough to spike my CPU usage and cause significant slow-down.
```

```
apt install fail2ban -y
nano /etc/fail2ban/filter.d/wordpress.conf
```
```
[Definition]
failregex = <HOST>.*POST.*(wp-login\.php|xmlrpc\.php).* (403|499|502)
```
```
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
nano /etc/fail2ban/jail.local
service fail2ban restart
```

```
cat /var/log/nginx/access.log
iptables -S
```

### Hide server_tokens

https://www.techrepublic.com/article/5-tips-for-better-nginx-security-that-any-admin-can-handle/

```
curl -I [LH redacted http://IP]
```
```
[...]
Server: nginx/1.14.0 (Ubuntu)
[...]
```


```
nano /etc/nginx/nginx.conf
```
```
server_tokens off;
```
```
service nginx restart
```

```
curl -I [LH redacted http://IP]
```
```
[...]
Server: nginx
[...]
```

### Hide expose_php (already set)

https://www.techrepublic.com/article/5-tips-for-better-nginx-security-that-any-admin-can-handle/

```
nano -c /etc/php/7.2/fpm/php.ini
```
Line 374
```
expose_php = Off
```

### Hide 401, 403

https://www.techrepublic.com/article/5-tips-for-better-nginx-security-that-any-admin-can-handle/

```
nano /etc/nginx/sites-enabled/wp
```
```
error_page 401 403 404 /404.html; 
```
```
nginx -t
service nginx restart
```


### Hide .htaccess files

https://codex.wordpress.org/Nginx
```
# Deny all attempts to access hidden files such as .htaccess, .htpasswd, .DS_Store (Mac).
# Keep logging the requests to parse later (or to pass to firewall utilities such as fail2ban)
```


Try http://[...IP...]/.htaccess

```
nano /etc/nginx/sites-enabled/wp
```
```
location ~ /\. {
	deny all;
}
```
```
nginx -t
service nginx restart
```

Try http://[...IP...]/.htaccess



### Disable XML-RPC


http://www.jeedo.net/deny-access-to-wordpress-xmlrpc-php-with-nginx/
```
The 444 response is unique to NGINX. The 444 status will cause NGINX to close the connection without sending any response. This will save your server’s processing power since it will not process the HTTP request at all.
```

https://bjornjohansen.no/block-access-to-php-files-with-nginx

```
location = /xmlrpc.php {
    deny all;
    access_log off;
    log_not_found off;
    return 444; # Close connection and send no response
}
```





### Secure /wp-admin

```
if anyone attempts to access the wp-admin folder [outside the network], they will be redirected to the error [...] page
[...]
your wp-admin section will now only allow 30 requests per minute. After that 30th request, the user will see the [503] error
```


We considered also allowing the Oxford Eduroam IP range (`allow 192.76.8.0/24;`) but decided against it. (Better safe than sorry!)

```
nano /etc/nginx/sites-enabled/wp
```
Above the server section:
```
limit_req_zone $binary_remote_addr zone=one:10m rate=30r/m;
```
```
location /wp-admin {
  allow 129.67.44.0/22; # WTCHG IP range
  allow 163.1.206.129/32; # BDI gateway
  deny all;
  limit_req zone=one;
}
```
```
nginx -t
service nginx restart
```

Test http://[...IP...]/wp-admin

On denied networks, see:
```
503 Service Temporarily Unavailable
nginx
```

On allowed networks, see WP login.




### Hide plugin files

(Note: this occurred after the plugins were installed and I noticed that the files were world-wide.

Try http://[...IP...]/wp-content/aiowps_backups/backup.wp-config.php
Try http://[...IP...]/wp-content/aiowps_backups/xj4p282zld_htaccess_backup.txt
Try http://[...IP...]/wp-content/updraft/log.fa0ac24f2b9a.txt
Try http://[...IP...]/wp-content/updraft/web.config

```
nano /etc/nginx/sites-enabled/wp
```
```
  # Hide plugin files from the world
  location ^~ /wp-content/aiowps_backups {
    allow 129.67.44.0/22; # WTCHG IP range
    allow 163.1.206.129/32; # BDI gateway
    deny all;
  }
  location ^~ /wp-content/updraft {
    allow 129.67.44.0/22; # WTCHG IP range
    allow 163.1.206.129/32; # BDI gateway
    deny all;
  }
```
```
nginx -t
service nginx restart
```

Try http://[...IP...]/wp-content/aiowps_backups/backup.wp-config.php
Try http://[...IP...]/wp-content/aiowps_backups/xj4p282zld_htaccess_backup.txt
Try http://[...IP...]/wp-content/updraft/log.fa0ac24f2b9a.txt
Try http://[...IP...]/wp-content/updraft/web.config


Withouth the ^~ thing a PHP file would give a 500 error, as it would try to run it.






### Install Sucuri Security plugin

Log in to WordPress as an admin
Plugins > Add New > Search plugins... Sucuri Security
Install
Activate

#### Security Headers - X-XSS-Protection, X-Frame-Options, 

https://kb.sucuri.net/warnings/hardening/headers-x-xss-protection

https://gist.github.com/plentz/6737338
```
# config to don't allow the browser to render the page inside an frame or iframe
# and avoid clickjacking http://en.wikipedia.org/wiki/Clickjacking
# if you need to allow [i]frames, you can use SAMEORIGIN or even set an uri with ALLOW-FROM uri
# https://developer.mozilla.org/en-US/docs/HTTP/X-Frame-Options
add_header X-Frame-Options SAMEORIGIN;

# when serving user-supplied content, include a X-Content-Type-Options: nosniff header along with the Content-Type: header,
# to disable content-type sniffing on some browsers.
# https://www.owasp.org/index.php/List_of_useful_HTTP_headers
# currently suppoorted in IE > 8 http://blogs.msdn.com/b/ie/archive/2008/09/02/ie8-security-part-vi-beta-2-update.aspx
# http://msdn.microsoft.com/en-us/library/ie/gg622941(v=vs.85).aspx
# 'soon' on Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=471020
add_header X-Content-Type-Options nosniff;

# This header enables the Cross-site scripting (XSS) filter built into most recent web browsers.
# It's usually enabled by default anyway, so the role of this header is to re-enable the filter for 
# this particular website if it was disabled by the user.
# https://www.owasp.org/index.php/List_of_useful_HTTP_headers
add_header X-XSS-Protection "1; mode=block";
```

```
nano -c /etc/nginx/sites-enabled/wp

```
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```
nginx -t
service nginx restart
```

#### Hardening

Go to the Hardening tab in the Sucuri WP plugin menu.

Block of Certain PHP Files?

Information Leakage (Does something about the WP README file, created on every update.)

Plugin and Theme Editor (Disables plugin and theme editors) - leave this open for now.

REM: disable file editing after resolved all plugins are settled.


### Install All In One WP Security & Firewall plugin

Log in to WordPress as an admin
Plugins > Add New > Search plugins... All In One WP Security & Firewall
Install
Activate

#### Enable login lockdown

NOTE: Previously installed a separate Login LockDown plugin.

WP Security > Critical Feature Status > Login Lockdown

Enable Login Lockdown Feature: Yes
Allow Unlock Requests: No
Max Login Attempts: 3
Login Retry Time Period: 5 mins
Time Length of Lockout: 60 minutes
Display Generic Error Message: Yes
Instantly Lockout Invalid Usernames: No

Save Settings

#### File permissions

WP Security > Critical Feature Status > File Permissions

Set Recommended Permissions
```
Name	File/Folder	Current Permissions	Recommended Permissions
root directory	/var/www/wp/	0755	0755
wp-includes/	/var/www/wp/wp-includes	0755	0755
.htaccess	/var/www/wp/.htaccess	0644	0644
wp-admin/index.php	/var/www/wp/wp-admin/index.php	0644	0644
wp-admin/js/	/var/www/wp/wp-admin/js/	0755	0755
wp-content/themes/	/var/www/wp/wp-content/themes	0755	0755
wp-content/plugins/	/var/www/wp/wp-content/plugins	0755	0755
wp-admin/	/var/www/wp/wp-admin	0755	0755
wp-content/	/var/www/wp/wp-content	0755	0755
wp-config.php	/var/www/wp/wp-config.php	0644	0644
```

#### Change Database Prefix

WP Security > Database Security

Check `Check this if you want the plugin to generate a random 6 character string for the table prefix`

Press `Change DB Prefix`


#### Web Application Firewall (WAF)

WP Security > Firewall > Basic Firewall Rules

Check `Check this if you want to apply basic firewall protection to your site.`
```
This setting will implement the following basic firewall protection mechanisms on your site:

1) Protect your htaccess file by denying access to it.

2) Disable the server signature.

3) Limit file upload size (10MB).

4) Protect your wp-config.php file by denying access to it.

The above firewall features will be applied via your .htaccess file and should not affect your site's overall functionality.

You are still advised to take a backup of your active .htaccess file just in case.
```

Check `Check this if you are not using the WP XML-RPC functionality and you want to completely block external access to XMLRPC.`
```
This setting will add a directive in your .htaccess to disable access to the WordPress xmlrpc.php file which is responsible for the XML-RPC functionality in WordPress.

Hackers can exploit various vulnerabilities in the WordPress XML-RPC API in a number of ways such as:

1) Denial of Service (DoS) attacks

2) Hacking internal routers.

3) Scanning ports in internal networks to get info from various hosts.

Apart from the security protection benefit, this feature may also help reduce load on your server, particularly if your site currently has a lot of unwanted traffic hitting the XML-RPC API on your installation.

NOTE: You should only enable this feature if you are not currently using the XML-RPC functionality on your WordPress installation.

Leave this feature disabled and use the feature below if you want pingback protection but you still need XMLRPC.
```


Check `Check this if you want to block access to the debug.log file that WordPress creates when debug logging is enabled. `
```
WordPress has an option to turn on the debug logging to a file located in wp-content/debug.log. This file may contain sensitive information.

Using this optoin will block external access to this file. You can still access this file by logging into your site via FTP
```


#### Remove WP Generator Meta Info

WP Security > Settings > WP Version Info

Check `Check this if you want to remove the version and meta info produced by WP from all pages`



#### Display name obscurity

WP Security > User Accounts > Display Name

```
Your site currently has the following accounts which have an identical login name and display name. (Click on the link to edit the settings of that particular user account
```


#### Force WP User Logout

WP Security > User Login > Force Logout

Check `Check this if you want to force a wp user to be logged out after a configured amount of time`

Logout the WP User After XX Minutes: 60 mins


#### User Registration

NOTE: we won't be allowing user registration.

WP Security > User Registration > Manual Approval

Check `Check this if you want to automatically disable all newly registered accounts so that you can approve them manually.`


WP Security > User Registration > Registration Captcha

Check `Check this if you want to insert a captcha form on the WordPress user registration page (if you allow user registration).`


WP Security > User Registration > Registration Honeypot

Check `Check this if you want to enable the honeypot feature for the registration page`


#### Block Fake Googlebots

WP Security > Firewall > Internet Bots

Check `Check this if you want to block all fake Googlebots.`

```
This feature will check if the User Agent information of a bot contains the string "Googlebot".

It will then perform a few tests to verify if the bot is legitimately from Google and if so it will allow the bot to proceed.

If the bot fails the checks then the plugin will mark it as being a fake Googlebot and it will block it
```

#### 6G Blacklist Firewall Settings

WP Security > Firewall > 6G Blacklist Firewall Rules

Check `Check this if you want to apply the 6G Blacklist firewall protection from perishablepress.com to your site.`

```
This setting will implement the 6G security firewall protection mechanisms on your site which include the following things:

1) Block forbidden characters commonly used in exploitative attacks.

2) Block malicious encoded URL characters such as the ".css(" string.

3) Guard against the common patterns and specific exploits in the root portion of targeted URLs.

4) Stop attackers from manipulating query strings by disallowing illicit characters.

....and much more.
```

```
This feature allows you to activate the 6G (or legacy 5G) firewall security protection rules designed and produced by Perishable Press.

The 6G Blacklist is updated and improved version of 5G Blacklist. If you have 5G Blacklist active, you might consider activating 6G Blacklist instead.

The 6G Blacklist is a simple, flexible blacklist that helps reduce the number of malicious URL requests that hit your website.

The added advantage of applying the 6G firewall to your site is that it has been tested and confirmed by the people at PerishablePress.com to be an optimal and least disruptive set of .htaccess security rules for general WP sites running on an Apache server or similar.

Therefore the 6G firewall rules should not have any impact on your site's general functionality but if you wish you can take a backup of your .htaccess file before proceeding.
```


#### Disable Index Views, 

WP Security > Firewall > Additional Firewall Rules

Check `Check this if you want to disable directory and file listing.`
```
By default, an Apache server will allow the listing of the contents of a directory if it doesn't contain an index.php file.
This feature will prevent the listing of contents for all directories.
NOTE: In order for this feature to work "AllowOverride" of the Indexes directive must be enabled in your httpd.conf file. Ask your hosting provider to check this if you don't have access to httpd.conf
```
(NOTE: we're using Nginx, not Apache server.)


Check `Check this if you want to disable trace and track`
```
HTTP Trace attack (XST) can be used to return header requests and grab cookies and other information.
This hacking technique is usually used together with cross site scripting attacks (XSS).
Disabling trace and track on your site will help prevent HTTP Trace attacks.
```

Check `Check this if you want to forbid proxy comment posting.`
```
This setting will deny any requests that use a proxy server when posting comments.
By forbidding proxy comments you are in effect eliminating some SPAM and other proxy requests.
```

Check `This will help protect you against malicious queries via XSS.`
```
This feature will write rules in your .htaccess file to prevent malicious string attacks on your site using XSS.
NOTE: Some of these strings might be used for plugins or themes and hence this might break some functionality.
You are therefore strongly advised to take a backup of your active .htaccess file before applying this feature.
```

Check `This will block bad character matches from XSS.`
```
This is an advanced character string filter to prevent malicious string attacks on your site coming from Cross Site Scripting (XSS).
This setting matches for common malicious string patterns and exploits and will produce a 403 error for the hacker attempting the query.
NOTE: Some strings for this setting might break some functionality.
You are therefore strongly advised to take a backup of your active .htaccess file before applying this feature.
```


#### Database backups (Security Plugin managed)

NOTE: There are also backups managed by the UpdraftPlus plugin

WP Security > Database Security > DB Backup

Check `Check this if you want the system to automatically generate backups periodically based on the settings below`

Backup Time Interval: 1 Weeks
Number of Backup Files to Keep: 5

(I noticed that this was unchecked / disabled afterwards, without my knowledge / intention.)

#### Disable PHP File Editing

WP Security > Filesystem Security > PHP File Editing 

Check `Check this if you want to remove the ability for people to edit PHP files via the WP dashboard`


#### Disable WP File Access

WP Security > Filesystem Security > File Access

Check `Check this if you want to prevent access to readme.html, license.txt and wp-config-sample.php.`


#### Ban (example list of) User Agents

WP Security > Blacklist Manager > Ban Users

Check `Check this if you want to enable the banning (or blacklisting) of selected IP addresses and/or user agents specified in the settings below`

Enter User Agents:
```
baiduspider
SquigglebotBot
SurveyBot
VoidEYE
webcrawl.net
YottaShopping_Bot
```


#### Rename Login Page

WP Security > Brute Force

Check `Check this if you want to enable the rename login page feature`

....Is this a bad idea? Admin can get locked out if they forget/lose the URL.

/login and /admin redirect anyway.

Login Page URL: http://[...IP...]/slug

That stops /login and /admin from working.

Decided not to do this. Risk vs Benefit.


#### Cookie-based Brute Force Login Protection

WP Security > Brute Force > Cookie Based Brute Force Prevention

Check `Check this if you want to protect your login page from Brute Force Attack.`

```
This feature will deny access to your WordPress login page for all people except those who have a special cookie in their browser.
To use this feature do the following:
1) Enable the checkbox.
2) Enter a secret word consisting of alphanumeric characters which will be difficult to guess. This secret word will be useful whenever you need to know the special URL which you will use to access the login page (see point below).
3) You will then be provided with a special login URL. You will need to use this URL to login to your WordPress site instead of the usual login URL. NOTE: The system will deposit a special cookie in your browser which will allow you access to the WordPress administration login page.
Any person trying to access your login page who does not have the special cookie in their browser will be automatically blocked.
```

I decided against this. Risk vs Benefit.


#### Login Form Captchas

NOTE: We don't have WooCommerce installed.

WP Security > Brute Force > Login Captcha

Check:
```
Check this if you want to insert a captcha form on the login page
Check this if you want to insert captcha on a custom login form generated by the following WP function: wp_login_form()
Check this if you want to insert captcha on a Woocommerce login form
Check this if you want to insert captcha on a Woocommerce registration form
Check this if you want to insert a captcha form on the lost password page
``` 

Save Settings.


#### Login Whitelist

NOTE: we already have this at the Nginx site config level.

WP Security > Brute Force > Login Whitelist

Check `Check this if you want to enable the whitelisting of selected IP addresses specified in the settings below`

Enter Whitelisted IP Addresses:
```
163.1.206.129
129.67.44.*
```


#### Login Honeypot

(There is also one for user registration.)

WP Security > Brute Force > Honeypot

Check `Check this if you want to enable the honeypot feature for the login page`



#### Prevent comment spam

WP Security > SPAM Prevention

Check `Check this if you want to insert a captcha field on the comment forms`

Check `Check this if you want to apply a firewall rule which will block comments originating from spambots.`

More info
```
This feature will implement a firewall rule to block all comment attempts which do not originate from your domain.

A legitimate comment is one which is submitted by a human who physically fills out the comment form and clicks the submit button. For such events, the HTTP_REFERRER is always set to your own domain.

A comment submitted by a spambot is done by directly calling the comments.php file, which usually means that the HTTP_REFERRER value is not your domain and often times empty.

This feature will check and block comment requests which are not referred by your domain thus greatly reducing your overall blog SPAM and PHP requests done by the server to process these comments.
```


#### Enable Automated File Change Detection

WP Security > Scanner > File Change Detection

Check `Check this if you want the system to automatically/periodically scan your files to check for file changes based on the settings below`

Scan Time Interval: 1 day

(Ideally we want email enabled for this.)


#### Disable Users Enumeration

WP Security > Miscellaneous > Users Enumeration

Check `Check this if you want to stop users enumeration.`

```
This feature allows you to prevent external users/bots from fetching the user info with urls like "/?author=1".

When enabled, this feature will print a "forbidden" error rather than the user information.
```


#### Summary

WP Security > Dashboard > Security Strength Meter

```
Total Achievable Points: 505
Current Score of Your Site: 445 [430 before email settings?]
```

Now down to 425. (Ben "fiddled".)


## Backups

The backups (actually two sets, one for backup!) are initially created by WordPress plugins (AIOWPS and UpdraftPlus).
There is also a cron job to copy the backups to Coldline storage, on the Google Cloud.

### Which backup plugin to use for WordPress?
Decided to use the UpdraftPlus plugin (it seemed to be the most popular, highly rated, and free.)
https://www.wpbeginner.com/plugins/7-best-wordpress-backup-plugins-compared-pros-and-cons/
https://www.designbombs.com/best-backup-plugins-wordpress/
https://premium.wpmudev.org/blog/free-quality-backup-plugins/

### All In One WordPress Security (AIOWPS) plugin backups

WP Security > Database Security > DB Backups

These will act as a sort of backup backup!


Check `Check this if you want the system to automatically generate backups periodically based on the settings below`

Backup Time Interval: 1 week
Number of Backup Files To Keep: 5



```
Your DB Backup File location: /var/www/wp/wp-content/aiowps_backups/database-backup-20180710-150533-2yj0m9o680.sql
```




### Install UpdraftPlus

https://wordpress.org/plugins/updraftplus/

https://updraftplus.com/download/
```
1. Log in to your WordPress Site
2. Go to the plugins menu, and choose “Add New”
3. Search for “updraftplus”, and then click “Install now”
4. Activate it
5. Enter your preferred settings
```

Under settings for `UpdraftPlus Backup/Restore`, click on the link to configure scheduled backups.

Files backup schedule: Daily
and retain this many scheduled backups: 31

Database backup schedule: Daily
and retain this many scheduled backups: 31

Choose your remote storage: 

Don't choose Google Cloud, even though
```
Google Cloud support is available as an add-on - follow this link to get it
```

Because
```
Google Cloud Storage
£11.70 incl. VAT (United Kingdom (UK))

This Add-On enables your UpdraftPlus backups to be stored on your Google Cloud Storage account (not to be confused with Google Drive).
````


```
If you choose no remote storage, then the backups remain on the web-server. This is not recommended (unless you plan to manually copy them to your computer), as losing the web-server would mean losing both your website and the backups in one event.
```

Include in the files backup: Plugins, Themes, Uploads, 
Exclude these: backup*,*backups,backwpup*,wp-clone,snapshots
Include: Any other directories found inside wp-content
Exclude: upgrade,cache,updraft,backup*,*backups,mysql.sql,debug.log

```
The above directories are everything, except for WordPress core itself which you can download afresh from WordPress.org
```

Email: check [after you have email set up]
```
Check this box to have a basic report sent to your site's admin address [LH redacted].
```

Delete local backup: uncheck [we want to delete this when the cloud upload has succeeded]
```
Check this to delete any superfluous backup files from your server after the backup run finishes (i.e. if you uncheck, then any files despatched remotely will also remain locally, and any files being kept locally will not be subject to the retention limits).
```

Backup directory: updraft
```
Backup directory specified is writable, which is good.	This is where UpdraftPlus will write the zip files it creates initially. This directory must be writable by your web server. It is relative to your content directory (which by default is called wp-content).
```

Test the back up manually by clicking on the `Back Up Now` button in the UpdraftPlus settings.

Inspect the files on the server (e.g. using the cloud SSH web console).
The directory is /var/www/wp/wp-content/updraft

To start with:
```
-rw-r--r--  1 www-data www-data    16614 Jul  9 14:47 backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-db.gz
-rw-r--r--  1 www-data www-data   631772 Jul  9 14:47 backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-others.zip
-rw-r--r--  1 www-data www-data 10481452 Jul  9 14:47 backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-plugins.zip
-rw-r--r--  1 www-data www-data  2300588 Jul  9 14:47 backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-themes.zip
-rw-r--r--  1 www-data www-data      232 Jul  9 14:47 backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-uploads.zip
```

We want to name the backups in a similar way to the observatory database backups, i.e.
```
Daily backups rotate monthly and are named according to the day of the month, 02-daily.tar.gz to 31-daily.tar.gz, and won't exist when a monthly backup occurred instead. (Monthly backups always occur on the 1st day of the month.)

Monthly backups are named according to the date of the first day on the month, e.g. 2017-02-01-monthly.tar.gz.
```

We want to rename the files (the plugin does not provide configuration options for file names) so that:
```
backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-db.gz
backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-others.zip
backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-plugins.zip
backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-themes.zip
backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-uploads.zip
```
...Become bundled in to one file: 09-daily.tar.gz

If the day is 01, then:
```
backup_2018-07-01-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-db.gz
backup_2018-07-01-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-others.zip
backup_2018-07-01-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-plugins.zip
backup_2018-07-01-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-themes.zip
backup_2018-07-01-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-uploads.zip
```
...Become bundled in to one file: 2018-07-01-monthly.tar.gz


For details, see `cms_backup_resources/wp_backup_dev_notes.md`



## Automatic Security Updates

### WordPress updates

https://kinsta.com/blog/wordpress-automatic-updates/
```
With the specific purpose to improve the installation security and make the site administration easier, WordPress 3.7 introduced automatic updates. By default, this cool feature is enabled for minor releases (i.e. maintenance and security releases) and translation files, but it’s possible to customize any kind of updates. 
```

https://codex.wordpress.org/Configuring_Automatic_Background_Updates
```
Automatic background updates were introduced in WordPress 3.7 in an effort to promote better security, and to streamline the update experience overall. By default, only minor releases – such as for maintenance and security purposes – and translation file updates are enabled on most sites
[...]
By default, every site has automatic updates enabled for minor core releases and translation files. 
```

Decided against `WP_AUTO_UPDATE_CORE`. Risk vs Benefit.


### Ubuntu updates

https://websiteforstudents.com/setup-automatic-security-updates-on-ubuntu-18-04-lts-beta-server/

The unattended-upgrades package is already installed.
```
apt-cache policy unattended-upgrades
```
```
unattended-upgrades:
  Installed: 1.1ubuntu1
  Candidate: 1.1ubuntu1.18.04.1
  Version table:
     1.1ubuntu1.18.04.1 500
        500 http://europe-west1.gce.archive.ubuntu.com/ubuntu bionic-updates/main amd64 Packages
 *** 1.1ubuntu1 500
        500 http://europe-west1.gce.archive.ubuntu.com/ubuntu bionic/main amd64 Packages
        100 /var/lib/dpkg/status

```


The existing config for Unattended Upgrades can be seen:
```
nano /etc/apt/apt.conf.d/50unattended-upgrades
```
```
Unattended-Upgrade::Allowed-Origins {
        "${distro_id}:${distro_codename}";
        "${distro_id}:${distro_codename}-security";
        // Extended Security Maintenance; doesn't necessarily exist for
        // every release and this system may not have it installed, but if
        // available, the policy for updates is such that unattended-upgrades
        // should also install from here by default.
        "${distro_id}ESM:${distro_codename}";
//      "${distro_id}:${distro_codename}-updates";
//      "${distro_id}:${distro_codename}-proposed";
//      "${distro_id}:${distro_codename}-backports";
};
```

```
nano /etc/apt/apt.conf.d/20auto-upgrades
```
```
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```


Do we need `Download-Upgradeable-Packages`?

https://wiki.debian.org/UnattendedUpgrades
```
// Do "apt-get upgrade --download-only" every n-days (0=disable)
APT::Periodic::Download-Upgradeable-Packages "1";
```

https://debian-handbook.info/browse/stable/sect.regular-upgrades.html
```
APT::Periodic::Update-Package-Lists
This option allows you to specify the frequency (in days) at which the package lists are refreshed. apticron users can do without this variable, since apticron already does this task.

 APT::Periodic::Download-Upgradeable-Packages
Again, this option indicates a frequency (in days), this time for the downloading of the actual packages. Again, apticron users won't need it.

 APT::Periodic::AutocleanInterval
This option covers a feature that apticron doesn't have. It controls how often obsolete packages (those not referenced by any distribution anymore) are removed from the APT cache. This keeps the APT cache at a reasonable size and means that you don't need to worry about that task.

 APT::Periodic::Unattended-Upgrade
When this option is enabled, the daily script will execute unattended-upgrade (from the unattended-upgrades package) which — as its name suggest — can automatize the upgrade process for some packages (by default it only takes care of security updates, but this can be customized in /etc/apt/apt.conf.d/50unattended-upgrades). Note that this option can be set with the help of debconf by running dpkg-reconfigure -plow unattended-upgrades.
```

https://blog.mafr.de/2015/02/26/ubuntu-unattended-upgrades/
```
APT::Periodic::Update-Package-Lists “1”;
APT::Periodic::Download-Upgradeable-Packages “1”;
APT::Periodic::AutocleanInterval “7”;
APT::Periodic::Unattended-Upgrade “1”;
[...]
The other two you listed are not important for the security upgrade part unattended-upgrades – my setup works fine without them. They just run “apt-get autoclean” once a week and “apt-get upgrade –download-only” daily.
```



## Uncomplicated Firewall (UFW)

Don't do this. Google Cloud's firewall configuration should be sufficient.

https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04
```
Different applications can register their profiles with UFW upon installation. These profiles allow UFW to manage these applications by name. OpenSSH, the service allowing us to connect to our server now, has a profile registered with UFW.

You can see this by typing:
```
```
ufw app list
```
```
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```

```
We need to make sure that the firewall allows SSH connections so that we can log back in next time. We can allow these connections by typing:
```
```
ufw allow OpenSSH
```

```
ufw allow 'Nginx Full'
```


Decided against this, because it might conflict with Google Cloud firewall config, e.g.
https://cloud.google.com/vpc/docs/using-firewalls#cannot_connect_to_vm_instance
```
ufw enable [don't do]
ufw status
```

The Google Cloud VM instance details reports
```
Firewalls
[checked] Allow HTTP traffic
[checked] Allow HTTPS traffic
```

To delete:
```
ufw delete allow 'Nginx HTTP'
```

To view while inactive:
```
ufw show added
```

Further:
https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands


## SSL using Certbot and Let's Encrypt

https://geekflare.com/nginx-webserver-security-hardening-guide/
```
Use OpenSSL to generate CSR with 2048 bit and sha-2
```
```
[don't do this]
openssl req -nodes -new -sha256 -newkey rsa:2048 -keyout analytics-cms.key -out analytics-cms.csr
```

```
Get the CSR signed by certificate authority and once you have the signed certificate, you can implement them in nginx as below.
```

https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-18-04
```
A self-signed certificate may be appropriate if you do not have a domain name associated with your server and for instances where the encrypted web interface is not user-facing. If you do have a domain name, in many cases it is better to use a CA-signed certificate. You can find out how to set up a free trusted certificate with the Let's Encrypt project [here](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04).
```

https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04
```
The first step to using Let's Encrypt to obtain an SSL certificate is to install the Certbot software on your server.
Certbot is in very active development, so the Certbot packages provided by Ubuntu tend to be outdated. However, the Certbot developers maintain a Ubuntu software repository with up-to-date versions, so we'll use that repository instead.
```


### Set the server_name

(This is after getting a sub-domain from KK, who sets a DNS record on gandi.net for the IP address.)

```
nano /etc/nginx/sites-available/wp
```
```
server_name analytics-cms.malariagen.net
```
```
nginx -t
service nginx restart
``


### Install Certbot

```
add-apt-repository ppa:certbot/certbot
apt update
apt install python-certbot-nginx -y
```


### Get an SSL certificate

```
certbot --nginx -d analytics-cms.malariagen.net
```

https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04
```
If this is your first time running certbot, you will be prompted to enter an email address and agree to the terms of service. After doing so, certbot will communicate with the Let's Encrypt server, then run a challenge to verify that you control the domain you're requesting a certificate for.
```

```
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
-------------------------------------------------------------------------------
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
```

I chose to redirect, but this seemed to confuse WordPress while the domain name was not yet in effect.
I had to use https://[...IP...] to access.
And one of the security plugins complained:
```
SUCURI: SiteCheck error: Unable to properly scan your site. Site returning error (40x): HTTP/1.1 404 Not Found
```


Revert to no redirect:
```
certbot --nginx -d analytics-cms.malariagen.net
```
```
What would you like to do?
1: Attempt to reinstall this existing certificate
2: Renew & replace the cert (limit ~5 per 7 days)
```

Attempt to reinstall.
Choose `No redirect`.

Didn't seem to work. Nginx config still looks the same.

https://github.com/certbot/certbot/issues/4198
https://certbot.eff.org/docs/using.html#certbot-command-line-options
```
certbot --nginx rollback
```

That seemed to work after the second run. (?!)

Trying this again:
```
certbot --nginx -d analytics-cms.malariagen.net
```
```
What would you like to do?
1: Attempt to reinstall this existing certificate
2: Renew & replace the cert (limit ~5 per 7 days)
```

Attempt to reinstall.
Choose `No redirect`.


Everything looks good. HTTP and HTTPS work as expected.



Test the renewal:
```
certbot renew --dry-run
```


### Check certificate

https://gist.github.com/cecilemuller/a26737699a7e70a7093d4dc115915de8
```
certbot certificates
```
```
Saving debug log to /var/log/letsencrypt/letsencrypt.log

-------------------------------------------------------------------------------
Found the following certs:
  Certificate Name: analytics-cms.malariagen.net
    Domains: analytics-cms.malariagen.net
    Expiry Date: 2018-10-09 09:32:59+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/analytics-cms.malariagen.net/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/analytics-cms.malariagen.net/privkey.pem
-------------------------------------------------------------------------------
```

### Hardening SSL

Guides
https://geekflare.com/nginx-webserver-security-hardening-guide/
https://gist.github.com/cecilemuller/a26737699a7e70a7093d4dc115915de8
https://help.dreamhost.com/hc/en-us/articles/222784068-The-most-important-steps-to-take-to-make-an-nginx-server-more-secure

These steps have not been implemented or fully explored yet.


#### Add HTTP/2 support (?)

https://gist.github.com/cecilemuller/a26737699a7e70a7093d4dc115915de8
```
Certbot didn't add HTTP/2 support when it created the new server blocks [...]
```

https://github.com/certbot/certbot/issues/3646

This isn't important to us right now, so I will leave as is. Risk vs Benefit.


#### Add OCSP Stapling (?)

Decided not to do this. Having an A+ rating from SSL Labs is not important enough right now.

https://gist.github.com/cecilemuller/a26737699a7e70a7093d4dc115915de8
```
nano /etc/nginx/sites-available/wp
```
```
ssl_trusted_certificate /etc/letsencrypt/live/analytics-cms.malariagen.net/chain.pem;
```
```
nginx -t
service nginx restart
```

The guide then proceeds to edit `/etc/letsencrypt/options-ssl-nginx.conf`

Decided not to proceed. I'm not convinced this is good/standard practice or worthwhile.
It's messing around, manually, with otherwise straightforward things.




## Domain name

Via KK, who set a DNS record on gandi.net for the IP address.

After the domain name has come into effect, some things (esp. WP) will need updating.

When the domain name is working (use HTTPS)
Log in to the WP admin (you can use IP)
Go to Settings > General

Update
WordPress Address (URL)
Site Address (URL)

Save Changes



## Email

Mailgun requires a credit card number, even for their free account.

Log in to WordPress as an admin
Plugins > Add New > Search plugins... WP Mail SMTP by WPForms
Install
Activate

Settings > WP Mail SMTP

Force From Email
Force From Name
Mailer: PHP

Check `Set the return-path to match the From Email`
```
Return Path indicates where non-delivery receipts - or bounce messages - are to be sent.
If unchecked bounce messages may be lost.
```

Email Test
Send to


https://wpforms.com/how-to-securely-send-wordpress-emails-using-gmail-smtp/

Create a Gmail account for malariagen.analytics@gmail.com

Add forwarding to my account.
Gmail > Settings > Forwarding and POP/IMAP > Forwarding > Add a forwarding address > ...
Receive confirmation code in target inbox.
Enter confirmation code in malariagen.analytics@gmail.com settings.


https://console.developers.google.com/flows/enableapi?apiid=gmail&pli=1

Then Go to Credentials

Which API are you using? Gmail API
Where will you be calling the API from? Web server (e.g. node.js, Tomcat)
What data will you be accessing? User data

Authorized JavaScript origins

https://[...IP...]

Get the Auhtorized redirect URI from the plugin settings
https://[...IP...]/wp-admin/options-general.php?page=wp-mail-smtp&tab=auth

ERROR: Can't do this with just an IP.
```
Invalid Redirect: https://[...IP...]/wp-admin/options-general.php?page=wp-mail-smtp&tab=auth must end with a public top-level domain (such as .com or .org)

```

After getting SSL and DNS configured
https://wpforms.com/how-to-securely-send-wordpress-emails-using-gmail-smtp/
```
Step 2: Create a Web Application
To create an application, you’ll first need to sign into your Gmail account and access Gmail’s application registration. Clicking that link should open this Google page in a new tab or window, and you’ll want to keep your site settings open (we’ll return to those later).
```

The link in question: https://console.developers.google.com/flows/enableapi?apiid=gmail&pli=1

```
Once you’ve followed that link and logged into your Gmail account, you should see a form named “Register your application for Gmail API in Google API Console”.

In the dropdown labeled Select a project where your application will be registered, leave the default option of Create a project. Then, go ahead and click the Continue button.

Create a project for Gmail app registration

Next, you should see a screen that says “The API is enabled”. To proceed to the setup page, click the Go to credentials button.

Gmail API is enabled

In the next page, you’ll be prompted to determine the credentials you need. Here are the fields on this page and the options you’ll need to select:

Which API are you using? Gmail API
Where will you be calling the API from? Web server (e.g. node.js, Tomcat)
What data will you be accessing? User data
Once you’ve made these selections, click the What credentials do I need? button to go to the next step.

Add credentials to Gmail app project

For this step, you’ll be creating an OAuth client ID. OAuth, or Open Authorization, is what will provide permission for your website to use your Gmail account to authenticate emails.

For the Name field, enter anything you like or leave the default name. This is only for reference within your Google account.

For the Authorized JavaScript origins, you’ll need to enter your site’s URL.

Last, we need to fill out the Authorized redirect URIs field. To get the URI for your site, you’ll need to go back to the tab or window with your WordPress site. Still on the Settings » WP Mail SMTP page, you’ll need to look under the Gmail section for the field labeled Authorized redirect URI.

The value in this field should be your site’s URL followed by some extra details. You’ll need to copy this value, which is easily done by clicking the button with the copy icon.

Use button to copy authorized redirect URI from WP Mail SMTP settings

After copying the URI, return to the Google APIs page and paste it into the field under Authorized redirect URIs.

Create a Google OAuth client ID

After that, you can click the Create client ID button.

For the last step in the app creation process, you’ll need to set up the consent screen. This screen will never be seen by your users since you’re only granting permission for your own site to use the Gmail account you own.

You’ll just need to check your email address and then enter a Product name shown to users (such as the title of your website). When you’ve completed these fields, click Continue.

oauth client id

You’ve now successfully created a Gmail web application!

Now we need to see the full details. On the last screen, click I’ll do this later to go to the Credentials page.

Last page in Gmail app setup process

Step 3: Grant Permissions and Send Test Email
On the Credentials page, you can now see the details of the web application you just created. To view Client ID and Client Secret, click the edit icon.

Click the edit icon on the Credentials page

This will open all of the details for your app. On this page, you’ll need to copy the Client ID and Client secret values.

Each of these will need to be copied into your WP Mail SMTP settings back in your WordPress admin.

Note: Be very careful not to copy any extra text or spaces with your Client ID or Client Secret, as this will result in an error in the next step.
Copy in Client ID and secret to WP Mail SMTP settings

After saving these settings, the page will refresh. Before Google allows this information to be used to connect to your account, however, you must grant permission.

To do this, scroll to the bottom of this page and click the button labeled Allow plugin to send emails using your Google account.

Authorize plugin to send emails with Gmail

This will open a login screen for Google. Go ahead and log into the account you’re setting this SMTP up with. Then, you’ll see a screen asking for permission for this site to send email on your behalf.

When you’re ready, click the Allow button to proceed.

Grant permission for site to send email

Next, you’ll be returned to your WP Mail SMTP settings and a success message will be displayed. Now that the connection is complete, you’re ready to send a test email under the Email Test tab.

Gmail connection success with WP Mail SMTP

Once the Test Email tab is open, you’ll need to enter a valid email address and click the Send Email button. Be sure to use an email address you have access to so you can confirm the email is delivered.

Send a test email through WP Mail SMTP

When the test message has been sent, you’ll see a success message at the top of this tab.

WP Mail SMTP test email was sent successfully

You should also soon receive a test email at the email address you entered.

Test email for WP Mail SMTP Gmail

```


Are there any settings in WP that need changing to the new email address?
In general, we want to use a product-owner or sys-admin address in there. (Less fragile.)

WP Security > User Login > Login Lockdown
Check `Check this if you want to receive an email when someone has been locked out due to maximum failed login attempts `
Keep an admin email address.

WP Security > Scanner > File Change Detection
Check `Check this if you want the system to email you if a file change was detected`

UpdraftPlus Backups > Settings
Check `Check this box to have a basic report sent to your site's admin address`


## Disable comments

https://themeisle.com/blog/disable-comments-in-wordpress/

Settings > Discussion

Disable `Attempt to notify any blogs linked to from the article `
Disable `Allow link notifications from other blogs (pingbacks and trackbacks) on new articles `
Disable `Allow people to post comments on new articles`

Check `Users must be registered and logged in to comment`
Check `Automatically close comments on articles older than 1 days`

Disable `Enable threaded (nested) comments`

Check `Email me whenever: Anyone posts a comment`
Check `Email me whenever: A comment is held for moderation`

Check `Comment must be manually approved`
Check `Comment author must have a previously approved comment`

Maximum Rating `G — Suitable for all audiences`



## Add users

We have user X (a content editor) and user Y (a content editor and sys admin) to add.

Log in to WP admin.
Users > Add New

We need to ask each user what username and email they require.
I guess a password will be provided to them?

Check `Send the new user an email about their account.`

Role: X is an Editor
Role: Y is an Administrator




## Maintenance

### Updates and upgrades

#### Ubuntu, Nginx, MariaDB, PHP 

#### WordPress

passwords




## Developments under consideration

### Use of link manager: Pretty Links or ThirstyAffiliates

Log in to WordPress as an admin
Plugins > Add New > Search plugins... Pretty Links
Install
Activate

Log in to WordPress as an admin
Plugins > Add New > Search plugins... ThirstyAffiliates
Install
Activate


I haven't decided which of these plugins is best for us. (Or even if wanted.)


### WordPress cache plugin


http://jonnyreeves.co.uk/2016/wordpress-on-a-google-compute-engine-f1-micro/
```
WP Super Cache plugin is essential for a Wordpress install on a low-end server - installation is straight forward from the Wordpress Admin.
```

https://www.isitwp.com/best-wordpress-caching-plugins-compared/
```
1. W3 Total Cache
With over a million active installs, W3 Total Cache is one of the most popular caching plugins for WordPress.
```

Compared to WP Super Cache, W3 Total Cache has 3,850 reviews averaging 4.5/5 stars, as opposed to 1,179.


Log in to WordPress as an admin
Plugins > Add New > Search plugins... W3 Total Cache
Install
Activate


```
nginx.conf rules have been updated. Please restart nginx server to provide a consistent user experience.
```

```
service nginx restart
```

I decided to disactivate this plugin. (No immediate significant benefit in investing in researching how to best configure it.)


### Changes to the RSS feed


From Ben:
```
In wp-includes/feed.php add:
function the_thumbnail_rss() {
    global $post;
    if ( has_post_thumbnail( $post->ID ) ) {
       echo get_the_post_thumbnail( $post->ID );
    }
}

In wp-includes/feed-rss2.php in the <item> tag:
<thumbnail><?php the_thumbnail_rss() ?></thumbnail>
```

Refers to `/var/www/wp/wp-includes/`

NOTE: Changing the WordPress "core" is sometimes frowned upon (e.g. https://getflywheel.com/layout/wp-core/)
because the changes might be overwritten when WP updates, or might have unintended consequences (e.g. assumptions made about the "core" behaviour)
so we should look at transferring this modified behaviour to a plugin, which will also get backed up, have higher visibility, etc.

###############













