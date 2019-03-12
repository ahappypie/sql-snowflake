[![Docker Repository on Quay](https://quay.io/repository/ahappypie/sql-snowflake/status "Docker Repository on Quay")](https://quay.io/repository/ahappypie/sql-snowflake)
# sql-snowflake
Move SQL objects from your database to a Snowflake table. Uses S3 to stage files.

## Dockerfile
A docker image is published to [quay.io/ahappypie/sql-snowflake](https://quay.io/ahappypie/sql-snowflake). Use the environment variables below to configure the job.

## Environment Variables
* `SQL_DIALECT`: Tells [sql-s3](https://github.com/ahappypie/sql-s3) which driver to use. Can be one of the following: `['mysql', 'pg', 'sqlite3', 'mssql']`
* `SQL_USER`: The user to log in to your database with
* `SQL_PASSWORD`: Password for the above user
* `SQL_HOST`: Host address where your database lives (include port if needed here)
* `SQL_DATABASE`: Name of database to connect to
* `SQL_SCHEMA`: Schema where your table lives
* `SQL_TABLE`: Object you want to move
* `AWS_ACCESS_KEY`: Key for the S3 bucket
* `AWS_SECRET_KEY`: Secret for the S3 bucket
* `AWS_REGION`: Region where your S3 bucket lives
* `BUCKET`: S3 bucket you want your object to end up in
* `KEY_PREFIX`: (Optional) Used to customize the key of your S3 object. Otherwise defaults to `${SQL_DATABASE}/${SQL_SCHEMA}/${SQL_TABLE}`
* `DROP_COLUMNS`: (Optional) Comma separated list of columns you don't want. Otherwise returns `SELECT *`
* `COMPRESS`: (Optional) When true, passes stream through gzip compression. Defaults to `true`
* `SNOWFLAKE_ACCOUNT`: Snowflake account ID (You can find this in your Snowflake URL)
* `SNOWFLAKE_REGION`: Region your Snowflake account lives in
* `SNOWFLAKE_WAREHOUSE`: Warehouse that is used to execute commands. [snowflake-load](https://github.com/ahappypie/snowflake-load) only executes the minimal amount of commands to load an object
* `SNOWFLAKE_USER`: User to run commands under
* `SNOWFLAKE_ROLE`: Role the above user operates as
* `SNOWFLAKE_PASSWORD`: Password for above user
* `SNOWFLAKE_DATABASE`: Database you want to load to
* `SNOWFLAKE_SCHEMA`: Schema you want to load to
* `SNOWFLAKE_TABLE`: Table you want to load to