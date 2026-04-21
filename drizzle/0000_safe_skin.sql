CREATE TABLE "bills" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bills_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"bill_number" varchar(100) NOT NULL,
	"customer_id" integer NOT NULL,
	"meter_id" integer,
	"billing_period_from" date NOT NULL,
	"billing_period_to" date NOT NULL,
	"issued_date" date NOT NULL,
	"due_date" date NOT NULL,
	"status" varchar(50) NOT NULL,
	"consumption_m3" numeric(14, 3) NOT NULL,
	"tariff_tier" varchar(100),
	"base_charge" numeric(14, 2) DEFAULT '0' NOT NULL,
	"consumption_charge" numeric(14, 2) DEFAULT '0' NOT NULL,
	"sewerage_charge" numeric(14, 2) DEFAULT '0' NOT NULL,
	"vat" numeric(14, 2) DEFAULT '0' NOT NULL,
	"penalty" numeric(14, 2) DEFAULT '0' NOT NULL,
	"discount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(14, 2) NOT NULL,
	"paid_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"balance" numeric(14, 2) NOT NULL,
	"previous_balance" numeric(14, 2) DEFAULT '0' NOT NULL,
	"generated_by" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "consumption_alerts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "consumption_alerts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"customer_id" integer NOT NULL,
	"meter_id" integer NOT NULL,
	"alert_type" varchar(100) NOT NULL,
	"detected_at" timestamp NOT NULL,
	"consumption_m3" numeric(14, 3) NOT NULL,
	"baseline_m3" numeric(14, 3) NOT NULL,
	"deviation_percent" numeric(8, 2) NOT NULL,
	"acknowledged" boolean DEFAULT false NOT NULL,
	"acknowledged_by" integer,
	"acknowledged_at" timestamp,
	"work_order_id" integer,
	"message" text
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "customers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"account_number" varchar(100) NOT NULL,
	"user_id" integer,
	"national_id" varchar(100),
	"full_name" varchar(255) NOT NULL,
	"phone" varchar(50),
	"email" varchar(255),
	"account_type" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"zone" varchar(255),
	"department" varchar(255),
	"address_json" jsonb,
	"plot_number" varchar(100),
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"language_preference" varchar(50),
	"digital_enrolled" boolean DEFAULT false NOT NULL,
	"preferred_notif_channel" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "fault_reports" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "fault_reports_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"fault_code" varchar(100) NOT NULL,
	"reported_by_customer_id" integer,
	"reported_by_user_id" integer,
	"fault_type" varchar(100) NOT NULL,
	"description" text,
	"zone" varchar(255),
	"address_json" jsonb,
	"severity" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"affected_customers" integer,
	"work_order_id" integer,
	"reported_at" timestamp DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp,
	"resolved_at" timestamp,
	"resolution_summary" text,
	"nrw_impact_m3" numeric(14, 3)
);
--> statement-breakpoint
CREATE TABLE "meter_readings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "meter_readings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"meter_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"reading_date" timestamp NOT NULL,
	"consumption_m3" numeric(14, 3) NOT NULL,
	"previous_reading_m3" numeric(14, 3) NOT NULL,
	"current_reading_m3" numeric(14, 3) NOT NULL,
	"reading_method" varchar(100) NOT NULL,
	"read_by" integer,
	"is_estimated" boolean DEFAULT false NOT NULL,
	"anomaly_flag" boolean DEFAULT false NOT NULL,
	"anomaly_reason" text,
	"image_path" text
);
--> statement-breakpoint
CREATE TABLE "meters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "meters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"serial_number" varchar(100) NOT NULL,
	"customer_id" integer NOT NULL,
	"meter_type" varchar(100) NOT NULL,
	"install_date" date,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"zone" varchar(255),
	"address_json" jsonb,
	"manufacturer" varchar(255),
	"model_number" varchar(255),
	"calibration_due_date" date,
	"nominal_flow_rate" numeric(12, 3)
);
--> statement-breakpoint
CREATE TABLE "model_has_permissions" (
	"model_type" varchar(255) NOT NULL,
	"model_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	CONSTRAINT "model_has_permissions_model_type_model_id_permission_id_pk" PRIMARY KEY("model_type","model_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "model_has_roles" (
	"model_type" varchar(255) NOT NULL,
	"model_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "model_has_roles_model_type_model_id_role_id_pk" PRIMARY KEY("model_type","model_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"payment_reference" varchar(100) NOT NULL,
	"customer_id" integer NOT NULL,
	"bill_id" integer,
	"amount" numeric(14, 2) NOT NULL,
	"method" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"transaction_id" varchar(255),
	"phone_number" varchar(50),
	"card_last4" varchar(4),
	"bank_ref" varchar(255),
	"initiated_at" timestamp,
	"completed_at" timestamp,
	"receipt_number" varchar(100),
	"narration" text,
	"processed_by" integer
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"guard_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_access_tokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "personal_access_tokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tokenable_type" varchar(255) NOT NULL,
	"tokenable_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"token" text NOT NULL,
	"abilities" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"last_used_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "request_documents" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "request_documents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"request_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"path" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"uploaded_by" integer
);
--> statement-breakpoint
CREATE TABLE "request_status_history" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "request_status_history_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"request_id" integer NOT NULL,
	"status" varchar(50) NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"changed_by" integer,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"guard_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "service_requests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"request_number" varchar(100) NOT NULL,
	"service_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"status" varchar(50) NOT NULL,
	"priority" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"zone" varchar(255),
	"address_json" jsonb,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp,
	"assigned_at" timestamp,
	"resolved_at" timestamp,
	"closed_at" timestamp,
	"assigned_to" integer,
	"work_order_id" integer,
	"sla_breached" boolean DEFAULT false NOT NULL,
	"estimated_completion" timestamp
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "services_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"service_code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_sw" varchar(255),
	"department" varchar(255),
	"description" text,
	"module" varchar(100),
	"icon" varchar(100),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"sla_json" jsonb,
	"application_fee" numeric(14, 2) DEFAULT '0' NOT NULL,
	"requires_field_visit" boolean DEFAULT false NOT NULL,
	"self_service_eligible" boolean DEFAULT false NOT NULL,
	"documents_required_json" jsonb,
	"tags_json" jsonb
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"employee_id" varchar(100),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"role_id" integer,
	"department" varchar(255),
	"zone" varchar(255),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"password" text NOT NULL,
	"mfa_secret" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_order_materials" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "work_order_materials_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"work_order_id" integer NOT NULL,
	"item" varchar(255) NOT NULL,
	"quantity" numeric(14, 3) NOT NULL,
	"unit_cost" numeric(14, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_order_photos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "work_order_photos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"work_order_id" integer NOT NULL,
	"path" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "work_orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"work_order_number" varchar(100) NOT NULL,
	"request_id" integer,
	"fault_report_id" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL,
	"priority" varchar(50) NOT NULL,
	"zone" varchar(255),
	"address_json" jsonb,
	"technician_id" integer,
	"supervisor_id" integer,
	"scheduled_date" date,
	"scheduled_slot" varchar(100),
	"started_at" timestamp,
	"completed_at" timestamp,
	"estimated_hours" numeric(10, 2),
	"actual_hours" numeric(10, 2),
	"labour_cost" numeric(14, 2),
	"total_cost" numeric(14, 2),
	"completion_notes" text,
	"customer_signature" text
);
--> statement-breakpoint
ALTER TABLE "bills" ADD CONSTRAINT "bills_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bills" ADD CONSTRAINT "bills_meter_id_meters_id_fk" FOREIGN KEY ("meter_id") REFERENCES "public"."meters"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bills" ADD CONSTRAINT "bills_generated_by_users_id_fk" FOREIGN KEY ("generated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumption_alerts" ADD CONSTRAINT "consumption_alerts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumption_alerts" ADD CONSTRAINT "consumption_alerts_meter_id_meters_id_fk" FOREIGN KEY ("meter_id") REFERENCES "public"."meters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumption_alerts" ADD CONSTRAINT "consumption_alerts_acknowledged_by_users_id_fk" FOREIGN KEY ("acknowledged_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fault_reports" ADD CONSTRAINT "fault_reports_reported_by_customer_id_customers_id_fk" FOREIGN KEY ("reported_by_customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fault_reports" ADD CONSTRAINT "fault_reports_reported_by_user_id_users_id_fk" FOREIGN KEY ("reported_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meter_readings" ADD CONSTRAINT "meter_readings_meter_id_meters_id_fk" FOREIGN KEY ("meter_id") REFERENCES "public"."meters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meter_readings" ADD CONSTRAINT "meter_readings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meter_readings" ADD CONSTRAINT "meter_readings_read_by_users_id_fk" FOREIGN KEY ("read_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meters" ADD CONSTRAINT "meters_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_has_permissions" ADD CONSTRAINT "model_has_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_has_roles" ADD CONSTRAINT "model_has_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_bill_id_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."bills"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_documents" ADD CONSTRAINT "request_documents_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_documents" ADD CONSTRAINT "request_documents_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_status_history" ADD CONSTRAINT "request_status_history_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_status_history" ADD CONSTRAINT "request_status_history_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_order_materials" ADD CONSTRAINT "work_order_materials_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_order_photos" ADD CONSTRAINT "work_order_photos_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_technician_id_users_id_fk" FOREIGN KEY ("technician_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_supervisor_id_users_id_fk" FOREIGN KEY ("supervisor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bills_bill_number_unique" ON "bills" USING btree ("bill_number");--> statement-breakpoint
CREATE INDEX "bills_customer_id_idx" ON "bills" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "bills_meter_id_idx" ON "bills" USING btree ("meter_id");--> statement-breakpoint
CREATE INDEX "bills_due_date_idx" ON "bills" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "consumption_alerts_customer_id_idx" ON "consumption_alerts" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "consumption_alerts_meter_id_idx" ON "consumption_alerts" USING btree ("meter_id");--> statement-breakpoint
CREATE INDEX "consumption_alerts_detected_at_idx" ON "consumption_alerts" USING btree ("detected_at");--> statement-breakpoint
CREATE UNIQUE INDEX "customers_account_number_unique" ON "customers" USING btree ("account_number");--> statement-breakpoint
CREATE INDEX "customers_user_id_idx" ON "customers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "customers_phone_idx" ON "customers" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "customers_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "fault_reports_fault_code_unique" ON "fault_reports" USING btree ("fault_code");--> statement-breakpoint
CREATE INDEX "fault_reports_reported_by_customer_id_idx" ON "fault_reports" USING btree ("reported_by_customer_id");--> statement-breakpoint
CREATE INDEX "fault_reports_reported_by_user_id_idx" ON "fault_reports" USING btree ("reported_by_user_id");--> statement-breakpoint
CREATE INDEX "fault_reports_work_order_id_idx" ON "fault_reports" USING btree ("work_order_id");--> statement-breakpoint
CREATE INDEX "meter_readings_meter_id_idx" ON "meter_readings" USING btree ("meter_id");--> statement-breakpoint
CREATE INDEX "meter_readings_customer_id_idx" ON "meter_readings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "meter_readings_read_date_idx" ON "meter_readings" USING btree ("reading_date");--> statement-breakpoint
CREATE UNIQUE INDEX "meters_serial_number_unique" ON "meters" USING btree ("serial_number");--> statement-breakpoint
CREATE INDEX "meters_customer_id_idx" ON "meters" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "model_has_permissions_permission_id_idx" ON "model_has_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE INDEX "model_has_permissions_model_idx" ON "model_has_permissions" USING btree ("model_type","model_id");--> statement-breakpoint
CREATE INDEX "model_has_roles_role_id_idx" ON "model_has_roles" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "model_has_roles_model_idx" ON "model_has_roles" USING btree ("model_type","model_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_payment_reference_unique" ON "payments" USING btree ("payment_reference");--> statement-breakpoint
CREATE INDEX "payments_customer_id_idx" ON "payments" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "payments_bill_id_idx" ON "payments" USING btree ("bill_id");--> statement-breakpoint
CREATE INDEX "payments_transaction_id_idx" ON "payments" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "personal_access_tokens_tokenable_idx" ON "personal_access_tokens" USING btree ("tokenable_type","tokenable_id");--> statement-breakpoint
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" ON "personal_access_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "request_documents_request_id_idx" ON "request_documents" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "request_status_history_request_id_idx" ON "request_status_history" USING btree ("request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "service_requests_request_number_unique" ON "service_requests" USING btree ("request_number");--> statement-breakpoint
CREATE INDEX "service_requests_service_id_idx" ON "service_requests" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "service_requests_customer_id_idx" ON "service_requests" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "service_requests_assigned_to_idx" ON "service_requests" USING btree ("assigned_to");--> statement-breakpoint
CREATE UNIQUE INDEX "services_service_code_unique" ON "services" USING btree ("service_code");--> statement-breakpoint
CREATE INDEX "services_department_idx" ON "services" USING btree ("department");--> statement-breakpoint
CREATE INDEX "services_status_idx" ON "services" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_employee_id_unique" ON "users" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "users_role_id_idx" ON "users" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "work_order_materials_work_order_id_idx" ON "work_order_materials" USING btree ("work_order_id");--> statement-breakpoint
CREATE INDEX "work_order_photos_work_order_id_idx" ON "work_order_photos" USING btree ("work_order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "work_orders_work_order_number_unique" ON "work_orders" USING btree ("work_order_number");--> statement-breakpoint
CREATE INDEX "work_orders_request_id_idx" ON "work_orders" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "work_orders_fault_report_id_idx" ON "work_orders" USING btree ("fault_report_id");--> statement-breakpoint
CREATE INDEX "work_orders_technician_id_idx" ON "work_orders" USING btree ("technician_id");--> statement-breakpoint
CREATE INDEX "work_orders_supervisor_id_idx" ON "work_orders" USING btree ("supervisor_id");