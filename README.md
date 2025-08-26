# paperbridge
 Open source document management system


## Post-installation steps

### PostgreSQL Database Setup
#### 1. Database Installation
Install PostgreSQL using your system's package manager.
macOS:
```shell
brew install postgresql
brew services start postgresql
```

Linux (Example with Debian/Ubuntu): 

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

The commands to enable and start the PostgreSQL will depend on your distribution's init system.

- systemd (Debian, Ubuntu, CentOS, etc.):
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

- SysVinit or init.d :
```bash
sudo service postgresql start
sudo chkconfig postgresql on
```

Windows: Use the official installer from the PostgreSQL website.

#### 2. User Creation

After installation, create a new user and grant it permissions from the PostgreSQL command-line interface. 

Connect to the shell as the postgres user:
On Linux/macOS
```bash
sudo -u postgres psql
```

On Windows, open the "SQL Shell (psql)" app

Then, run these commands to create a user named paperbridge with a password. 
```sql
CREATE USER paperbridge WITH PASSWORD 'your_secure_password';
ALTER USER paperbridge WITH SUPERUSER;
\q
```

*Note: The SUPERUSER permission is for development only. Use a more restricted user for production.*

#### 3. Application Configuration
The backend will automatically create the database on startup. Simply update your `application.properties` file with the user credentials you just created.
```properties
# PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/paperbridge_db
spring.datasource.username=paperbridge
spring.datasource.password=your_secure_password
spring.datasource.driver-class-name=org.postgresql.Driver
```
Once the credentials are set, the database and schema will be created when you run the application.