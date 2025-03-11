CREATE TABLE events (
  id                 bigint      NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
  description        text        NOT NULL,
  fired_at           int         NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE users (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    login           varchar(30)   NOT NULL,
    password        varchar(30)   NOT NULL,
    email           varchar(50)   NOT NULL,
    first           varchar(50)   NOT NULL,
    last            varchar(50)   NOT NULL,
    locale          varchar(10)   NOT NULL,
    active          boolean       NOT NULL,
    creation_ts     timestamp     NOT NULL,
    expiration_date date          NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT login_unique_constraint UNIQUE (login),
    CONSTRAINT email_unique_constraint UNIQUE (email)
);

CREATE TABLE user_groups (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    title           varchar(50)   NOT NULL,
    description     text,
    owner_id        bigint        NOT NULL,
    testproject_id  bigint        NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT title_unique_constraint UNIQUE (title)
);

CREATE TABLE user_testproject_roles (
    id             bigint        NOT NULL,
    user_id        bigint        NOT NULL,
    testproject_id bigint        NOT NULL,
    role_id        bigint        NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    description     varchar(100)  NOT NULL,
    notes           text,

    PRIMARY KEY (id)
);

CREATE TABLE rights (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    description     varchar(100)  NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE role_rights (
    role_id         bigint        NOT NULL,
    right_id        bigint        NOT NULL,

    PRIMARY KEY (role_id, right_id)
);

CREATE TABLE milestones (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    name            varchar(100)  NOT NULL,
    description     text,
    start_date      date          NOT NULL,
    target_date     date          NOT NULL,
    is_completed    boolean       NOT NULL DEFAULT false,

    PRIMARY KEY (id)
);

CREATE TABLE testprojects (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    name            varchar(100)  NOT NULL,
    is_active       boolean       NOT NULL DEFAULT false,
    project_type_id bigint        NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT testproject_name_unique_constraint UNIQUE (name)
);

CREATE TABLE testproject_types (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    name            varchar(50)   NOT NULL,
    description     text, 

    PRIMARY KEY (id)
);

CREATE TABLE test_suites (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    testproject_id  bigint        NOT NULL,
    name            varchar(100)  NOT NULL,
    details         text,

    PRIMARY KEY (id),
    CONSTRAINT test_suite_name_unique_constraint UNIQUE (name)
);

CREATE TABLE tc_versions (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    tc_id           bigint        NOT NULL,
    testsuite_id    bigint        NOT NULL,
    version         integer       NOT NULL,
    status_id       bigint        NOT NULL,
    summary         text,
    preconditions   text,
    priority_id     bigint        NOT NULL,
    author_id       bigint        NOT NULL,
    creation_ts     timestamp     NOT NULL,
    updater_id      bigint        NOT NULL,
    modification_ts timestamp     NOT NULL,
    is_active       boolean       NOT NULL,
    is_open         boolean       NOT NULL,
    execution_type  integer       NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE tc_priorities (
    id              bigint       NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    name            varchar(50)  NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE tc_statuses (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    name            varchar(50)   NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE tc_steps (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    actions         text          NOT NULL,
    expected_results text         NOT NULL,
    is_shared       boolean       NOT NULL DEFAULT false,

    PRIMARY KEY (id)
);

CREATE TABLE tc_steps_for_tc (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    tc_id           bigint        NOT NULL,
    step_id         bigint        NOT NULL,
    is_active       boolean       NOT NULL DEFAULT true,

    PRIMARY KEY (id)
);

CREATE TABLE testplans (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    testproject_id  bigint        NOT NULL,
    milestone_id    bigint        NOT NULL,
    notes           text,
    is_active       boolean       NOT NULL DEFAULT true,
    is_open         boolean       NOT NULL DEFAULT true,

    PRIMARY KEY (id)
);

CREATE TABLE configurations (
    id                     bigint       NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    name                   varchar(100) NOT NULL,
    configuration_group_id bigint       NOT NULL,
    
    PRIMARY KEY (id),
    CONSTRAINT cofiguration_name_unique_constraint UNIQUE (name)
);

CREATE TABLE configuration_groups (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    name            varchar(100)  NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE tr_statuses (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    name            varchar(100)  NOT NULL,

    PRIMARY KEY(id)
);

CREATE TABLE test_runs (
    id                 bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    testplan_id        bigint        NOT NULL,
    tester_id          bigint        NOT NULL,
    execution_ts       timestamp     NOT NULL,
    status_id          bigint        NOT NULL,
    tcversion_id       bigint        NOT NULL,
    configuration_id   bigint        NOT NULL,
    execution_duration numeric(6,2),
    notes              text,

    PRIMARY KEY (id)
);

CREATE TABLE test_run_steps (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    test_run_id     bigint        NOT NULL,
    tcstep_id       bigint        NOT NULL,
    notes           text,
    status_id       bigint        NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE execution_bugs (
    test_run_id     bigint        NOT NULL,
    bug_id          varchar(64)   NOT NULL,
    tcstep_id       bigint        NOT NULL,

    PRIMARY KEY (test_run_id, bug_id, tcstep_id)
);

CREATE TABLE req_spec_versions (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    name            varchar(100)  NOT NULL,
    testproject_id  bigint,

    PRIMARY KEY (id)
);

CREATE TABLE req_versions (
    id              bigint        NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1),
    name            varchar(100)  NOT NULL,
    req_id          bigint        NOT NULL,
    req_spec_id     bigint        NOT NULL,
    version         integer       NOT NULL,
    scope           text,
    is_active       boolean       NOT NULL DEFAULT true,
    is_open         boolean       NOT NULL DEFAULT true,
    author_id       bigint        NOT NULL,
    creation_ts     timestamp     NOT NULL,
    modifier_id     bigint        NOT NULL,
    modification_ts timestamp,

    PRIMARY KEY (id)
);

CREATE TABLE req_relations (
    id              bigint        GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1) NOT NULL,
    req_version_id  bigint        NOT NULL,
    tc_version_id   bigint        NOT NULL,
    author_id       bigint        NOT NULL,
    creation_ts     timestamp,

    PRIMARY KEY (id)
);

CREATE TABLE attachments (
    id              bigint        GENERATED ALWAYS AS IDENTITY (INCREMENT BY 1 START WITH 1) NOT NULL,
    fk_id           bigint        NOT NULL,
    fk_table        varchar(250)  NOT NULL,
    title           varchar(250)  NOT NULL,
    description     varchar(250),
    file_name       varchar(100)  NOT NULL,
    file_path       varchar(250)  NOT NULL,
    file_size       integer       NOT NULL,
    file_type       varchar(250)  NOT NULL,
    date_added      timestamp     NOT NULL,
    content         bytea,
    compression_type integer      NOT NULL,

    PRIMARY KEY (id)
);

ALTER TABLE user_groups ADD FOREIGN KEY (owner_id) REFERENCES users (id);

ALTER TABLE user_groups ADD FOREIGN KEY (testproject_id) REFERENCES testprojects (id);

ALTER TABLE user_testproject_roles ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE user_testproject_roles ADD FOREIGN KEY (testproject_id) REFERENCES testprojects (id);

ALTER TABLE user_testproject_roles ADD FOREIGN KEY (role_id) REFERENCES roles (id);

ALTER TABLE role_rights ADD FOREIGN KEY (role_id) REFERENCES roles (id);

ALTER TABLE role_rights ADD FOREIGN KEY (right_id) REFERENCES rights (id);

ALTER TABLE testprojects ADD FOREIGN KEY (project_type_id) REFERENCES testproject_types (id);

ALTER TABLE test_suites ADD FOREIGN KEY (testproject_id) REFERENCES testprojects (id);

ALTER TABLE tc_versions ADD FOREIGN KEY (status_id) REFERENCES tc_statuses (id);

ALTER TABLE tc_versions ADD FOREIGN KEY (priority_id) REFERENCES tc_priorities (id);

ALTER TABLE tc_versions ADD FOREIGN KEY (testsuite_id) REFERENCES test_suites (id);

ALTER TABLE tc_versions ADD FOREIGN KEY (author_id) REFERENCES users (id);

ALTER TABLE tc_versions ADD FOREIGN KEY (updater_id) REFERENCES users (id);

ALTER TABLE tc_steps_for_tc ADD FOREIGN KEY (tc_id) REFERENCES tc_versions (id);

ALTER TABLE tc_steps_for_tc ADD FOREIGN KEY (step_id) REFERENCES tc_steps (id);

ALTER TABLE testplans ADD FOREIGN KEY (testproject_id) REFERENCES testprojects (id);

ALTER TABLE testplans ADD FOREIGN KEY (milestone_id) REFERENCES milestones (id);

ALTER TABLE configurations ADD FOREIGN KEY (configuration_group_id) REFERENCES configuration_groups (id);

ALTER TABLE test_runs ADD FOREIGN KEY (status_id) REFERENCES tr_statuses (id);

ALTER TABLE test_runs ADD FOREIGN KEY (testplan_id) REFERENCES testplans (id);

ALTER TABLE test_runs ADD FOREIGN KEY (tester_id) REFERENCES users (id);

ALTER TABLE test_runs ADD FOREIGN KEY (tcversion_id) REFERENCES tc_versions (id);

ALTER TABLE test_runs ADD FOREIGN KEY (configuration_id) REFERENCES configurations (id);

ALTER TABLE test_run_steps ADD FOREIGN KEY (status_id) REFERENCES tr_statuses (id);

ALTER TABLE test_run_steps ADD FOREIGN KEY (test_run_id) REFERENCES test_runs (id);

ALTER TABLE test_run_steps ADD FOREIGN KEY (tcstep_id) REFERENCES tc_steps (id);

ALTER TABLE execution_bugs ADD FOREIGN KEY (test_run_id) REFERENCES test_runs (id);

ALTER TABLE execution_bugs ADD FOREIGN KEY (tcstep_id) REFERENCES test_run_steps (id);

ALTER TABLE req_spec_versions ADD FOREIGN KEY (testproject_id) REFERENCES testprojects (id);

ALTER TABLE req_versions ADD FOREIGN KEY (req_spec_id) REFERENCES req_spec_versions (id);

ALTER TABLE req_relations ADD FOREIGN KEY (req_version_id) REFERENCES req_versions (id);

ALTER TABLE req_relations ADD FOREIGN KEY (tc_version_id) REFERENCES tc_versions (id);

ALTER TABLE req_relations ADD FOREIGN KEY (author_id) REFERENCES users (id);