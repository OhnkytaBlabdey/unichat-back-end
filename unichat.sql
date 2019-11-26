create table t_channel_in_groups
(
    id         int auto_increment
        primary key,
    group_id   int      not null,
    channel_id int      not null,
    createdAt  datetime not null,
    updatedAt  datetime not null
)
    charset = utf8mb4;

create table t_channels
(
    id        int auto_increment
        primary key,
    name      varchar(255)                                    not null,
    strategy  enum ('admin_only', 'free_to_chat', 'bot_only') not null,
    createdAt datetime                                        not null,
    updatedAt datetime                                        not null
)
    charset = utf8mb4;

create table t_groups
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    gid         int          not null,
    logo        varchar(255) not null,
    invite_code varchar(255) not null,
    createdAt   datetime     not null,
    updatedAt   datetime     not null,
    constraint gid
        unique (gid)
)
    charset = utf8mb4;

create table t_messages
(
    id             int auto_increment
        primary key,
    msg            varchar(255) not null,
    from_id        int          not null,
    to_id          int          not null,
    msg_channel_id int          not null,
    createdAt      datetime     not null,
    updatedAt      datetime     not null
)
    charset = utf8mb4;

create table t_user_in_groups
(
    id        int auto_increment
        primary key,
    group_id  int                                         not null,
    user_id   int                                         not null,
    role      enum ('owner', 'admin', 'normal', 'banned') not null,
    createdAt datetime                                    not null,
    updatedAt datetime                                    not null
)
    charset = utf8mb4;

create table t_users
(
    id            int auto_increment
        primary key,
    nickname      varchar(255)                         not null,
    password_hash varchar(255)                         not null,
    email_addr    varchar(255)                         not null,
    profile       varchar(255) default '你还记得你放过多少鸽子?吗' not null,
    uid           int                                  not null,
    avatar        varchar(255)                         not null,
    createdAt     datetime                             not null,
    updatedAt     datetime                             not null
)
    charset = utf8mb4;


