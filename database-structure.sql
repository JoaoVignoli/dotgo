create table "user" (
	id SERIAL not null primary key,
	name Varchar(255) not null,
	tax_id Varchar(14) not null,
	email Varchar(255) unique not null,
	phone Varchar(11) not null,
	birthday date not null,
	password Text not null,
	picture Text not null,
	role Text not null,
	specialty Text,
	verified Boolean,
	biography Text,
	created_at timestamp not null
);

create table social_media (
	id SERIAL not null primary key,
	service_holder_id int not null references "user"(id),
	type Varchar(255) not null,
	url Text not null
);

create table bank_details (
	id SERIAL not null primary key,
	bank int not null,
	agency int not null,
	tax_id_account_manager Varchar(14) not null,
	service_holder_id int references "user"(id)
);

create table feed (
	id serial not null primary key,
	service_holder_id int references "user"(id) not null,
	picture_url Text not null
);

create table address (
	id serial not null primary key,
	user_id int references "user"(id) not null,
	street Text not null,
	neighborhood Text not null,
	city Text not null,
	state Text not null,
	cep int not null,
	address_number int not null,
	observation Text,
	complement Text
);

create table certifacate (
	id serial not null primary key,
	name Varchar(255) not null,
	start_date date not null,
	end_date date,
	description Text,
	service_holder_id int references "user"(id) not null
);

create table category (
	id serial not null primary key,
	name Varchar(255) unique not null,
	icon Text not null
);

create table subcategory (
	id serial not null primary key,
	name Varchar(255) unique not null,
	category_id int references category(id) not null,
	icon text not null
);

create table product (
	id Serial not null primary key,
	name Varchar(255) not null,
	description Text,
	price decimal(10, 2) not null,
	estimated_time int,
	receive_attachments Boolean,
	auto_approve Boolean,
	price_to_be_agreed Boolean,
	time_to_be_agreed Boolean,
	created_at timestamp not null
);

create table product_picture (
	id Serial not null primary key,
	url Text not null,
	product_id int references product(id) not null
);

create table product_assignment (
	id Serial not null primary key,
	service_holder_id int not null references "user"(id),
	subcategory int not null references subcategory(id),
	product_id int not null references product(id)
);

create table service_order (
	id Serial not null primary key,
	product_assigment_id int not null references product_assignment(id),
	client_id int not null references "user"(id),
	total_value Decimal(10, 2) not null,
	observation Text,
	created_at TIMESTAMP not null,
	initial_date TIMESTAMP not null,
	previous_end_date TIMESTAMP not null,
	end_date TIMESTAMP,
	approval Boolean not null,
	wait_approval Boolean not null,
	user_approval int not null references "user"(id)
);

create table review (
	id Serial not null primary key,
	service_order_id int not null references service_order(id),
	reviewer_id int not null references "user"(id),
	reviewee_id int not null references "user"(id),
	rating int not null,
	comment text,
	created_at timestamp not null
);