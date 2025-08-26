# paperbridge
 Open source document management system

`...`

### PostgreSQL Database Setup
#### 1\. Database Installation
Install PostgreSQL using your system's package manager.
**macOS**:
```shell
  brew install postgresql
  brew services start postgresql
```

**Linux** (Example with Debian/Ubuntu): 

```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
```

The commands to enable and start PostgreSQL will depend on your distribution's init system.

**systemd** (Debian, Ubuntu, CentOS, etc.):
```bash
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
```

**Windows**: Use the official installer from the PostgreSQL website.

#### 2\. User Creation

After installation, create a new user and grant it permissions from the PostgreSQL command-line interface. 

Connect to the PostgreSQL shell:
* on Linux/MacOS, `sudo -u postgres psql`
* on Windows, open the "SQL Shell (psql)" app

Create the database and user:
```sql
CREATE DATABASE paperbridge;
CREATE USER paperbridge WITH PASSWORD 'your_secure_password';
REVOKE ALL PRIVILEGES ON DATABASE paperbridge FROM PUBLIC;
GRANT CONNECT ON DATABASE paperbridge TO paperbridge;
\c paperbridge
GRANT USAGE ON SCHEMA public TO paperbridge;
GRANT CREATE ON SCHEMA public TO paperbridge;
\q
```

#### 3\. Application Configuration
Rename `application.properties.example` to `application.properties` and insert user credentials.
```properties
# PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/paperbridge
spring.datasource.username=paperbridge
spring.datasource.password=your_secure_password
spring.datasource.driver-class-name=org.postgresql.Driver
```
The application will automatically populate the database on startup.