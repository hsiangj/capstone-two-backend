-- from the terminal run:
-- psql < expensebud.sql

DROP DATABASE IF EXISTS expensebud;
CREATE DATABASE expensebud;
\c expensebud

\i expensebud_schema.sql
\i expensebud_seed.sql 


DROP DATABASE IF EXISTS expensebud_test;
CREATE DATABASE expensebud_test;
\c expensebud_test

\i expensebud_schema.sql

