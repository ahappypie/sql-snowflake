const { stream } = require('sql-s3');
const load = require('snowflake-load');

const main = async () => {
    try {
        let streamStart = Date.now();
        console.log(`Streaming ${process.env.SQL_DATABASE}.${process.env.SQL_SCHEMA}.${process.env.SQL_TABLE}`);
        const s = await stream({
            SQL_DIALECT: process.env.SQL_DIALECT,
            SQL_USER: process.env.SQL_USER,
            SQL_PASSWORD: process.env.SQL_PASSWORD,
            SQL_HOST: process.env.SQL_HOST,
            SQL_DATABASE: process.env.SQL_DATABASE,
            AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
            AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
            AWS_REGION: process.env.AWS_REGION,
            SQL_TABLE: process.env.SQL_TABLE,
            SQL_SCHEMA: process.env.SQL_SCHEMA,
            COMPRESS: process.env.COMPRESS || true,
            BUCKET: process.env.BUCKET,
            DROP_COLUMNS: process.env.DROP_COLUMNS,
            KEY_PREFIX: process.env.KEY_PREFIX
        });
        console.log(`Streamed ${process.env.SQL_DATABASE}.${process.env.SQL_SCHEMA}.${process.env.SQL_TABLE} in ${humanTime(Date.now() - streamStart)}`);
        console.log(`Loading ${s.Bucket}/${s.Key} to ${process.env.SNOWFLAKE_DATABASE}.${process.env.SNOWFLAKE_SCHEMA}.${process.env.SNOWFLAKE_TABLE}`);
        await load({
            account: process.env.SNOWFLAKE_ACCOUNT,
            username: process.env.SNOWFLAKE_USER,
            password: process.env.SNOWFLAKE_PASSWORD,
            region: process.env.SNOWFLAKE_REGION,
            database: process.env.SNOWFLAKE_DATABASE,
            schema: process.env.SNOWFLAKE_SCHEMA,
            warehouse: process.env.SNOWFLAKE_WAREHOUSE,
            role: process.env.SNOWFLAKE_ROLE,
            table: process.env.SNOWFLAKE_TABLE,
            bucket: s.Bucket,
            key: s.Key,
            aws_access_key: process.env.AWS_ACCESS_KEY,
            aws_secret_key: process.env.AWS_SECRET_KEY
        });
        console.log(`Loaded ${s.Bucket}/${s.Key} to ${process.env.SNOWFLAKE_DATABASE}.${process.env.SNOWFLAKE_SCHEMA}.${process.env.SNOWFLAKE_TABLE}`);
    } catch(ex) {
        console.error(ex);
    } finally {
        console.log('Exiting...');
        process.exit(0);
    }
};


const humanTime = (ms) => {
    /**
    console.log(humanTime(255)); //255ms
    console.log(humanTime(2555)); //2s 555ms
    console.log(humanTime(25555)); //25s 555ms
    console.log(humanTime(255555)); //4m 15s 555ms
    console.log(humanTime(2555555)); //42m 35s 555ms
    console.log(humanTime(25555555)); //7hr 5m 55s 555ms
    console.log(humanTime(255555555)); //2d 22hr 59m 15s 555ms
    **/
    if(ms < 1000) {
        return `${ms}ms`;
    } else if(ms < (60 * 1000)) {
        return `${Math.trunc(ms / 1000)}s ${humanTime(ms % 1000)}`;
    } else if(ms < (60 * 60 * 1000)) {
        return `${Math.trunc(ms / 60 / 1000)}m ${humanTime(ms % (60 * 1000))}`
    } else if(ms < (24 * 60 * 60 * 1000)) {
        return `${Math.trunc(ms / 60 / 60 / 1000)}hr ${humanTime(ms % (60 * 60 * 1000))}`
    } else if(ms < (7 * 24 * 60 * 60 * 1000)) {
        return `${Math.trunc(ms / 24 / 60 / 60 / 1000)}d ${humanTime(ms % (24 * 60 * 60 * 1000))}`
    }
};

main();