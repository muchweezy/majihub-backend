import {
    pgTable,
    integer,
    bigint,
    varchar,
    text,
    timestamp,
    boolean,
    jsonb,
    uniqueIndex,
    index,
    primaryKey,
    serial,
    numeric,
    date,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';


const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
};



// Define the 'demo_users' table
export const demoUsers = pgTable('demo_users', {
    id: integer('id').primaryKey(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull().unique(),
    ...timestamps,
});


/* =========================
   Users & Auth
========================= */

export const roles = pgTable('roles', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    guardName: varchar('guard_name', { length: 255 }).notNull(),
});

export const permissions = pgTable('permissions', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    guardName: varchar('guard_name', { length: 255 }).notNull(),
});

export const users = pgTable('users', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    employeeId: varchar('employee_id', { length: 100 }),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    roleId: integer('role_id').references(() => roles.id, { onDelete: 'set null' }),
    department: varchar('department', { length: 255 }),
    zone: varchar('zone', { length: 255 }),
    status: varchar('status', { length: 50 }).notNull().default('active'),
    password: text('password').notNull(),
    mfaSecret: text('mfa_secret'),
    ...timestamps,
}, (table) => [
    uniqueIndex('users_email_unique').on(table.email),
    uniqueIndex('users_employee_id_unique').on(table.employeeId),
    index('users_role_id_idx').on(table.roleId),
]);

export const modelHasRoles = pgTable('model_has_roles', {
    modelType: varchar('model_type', { length: 255 }).notNull(),
    modelId: integer('model_id').notNull(),
    roleId: integer('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
}, (table) => [
    primaryKey({ columns: [table.modelType, table.modelId, table.roleId] }),
    index('model_has_roles_role_id_idx').on(table.roleId),
    index('model_has_roles_model_idx').on(table.modelType, table.modelId),
]);

export const modelHasPermissions = pgTable('model_has_permissions', {
    modelType: varchar('model_type', { length: 255 }).notNull(),
    modelId: integer('model_id').notNull(),
    permissionId: integer('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
}, (table) => [
    primaryKey({ columns: [table.modelType, table.modelId, table.permissionId] }),
    index('model_has_permissions_permission_id_idx').on(table.permissionId),
    index('model_has_permissions_model_idx').on(table.modelType, table.modelId),
]);

export const personalAccessTokens = pgTable('personal_access_tokens', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    tokenableType: varchar('tokenable_type', { length: 255 }).notNull(),
    tokenableId: integer('tokenable_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    token: text('token').notNull(),
    abilities: text('abilities').array().notNull().default(sql`ARRAY[]::text[]`),
    lastUsedAt: timestamp('last_used_at', { mode: 'date' }),
}, (table) => [
    index('personal_access_tokens_tokenable_idx').on(table.tokenableType, table.tokenableId),
    uniqueIndex('personal_access_tokens_token_unique').on(table.token),
]);

/* =========================
   Customers
========================= */

export const customers = pgTable('customers', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    accountNumber: varchar('account_number', { length: 100 }).notNull(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
    nationalId: varchar('national_id', { length: 100 }),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    email: varchar('email', { length: 255 }),
    accountType: varchar('account_type', { length: 100 }).notNull(),
    status: varchar('status', { length: 50 }).notNull().default('active'),
    zone: varchar('zone', { length: 255 }),
    department: varchar('department', { length: 255 }),
    addressJson: jsonb('address_json'),
    plotNumber: varchar('plot_number', { length: 100 }),
    registeredAt: timestamp('registered_at', { mode: 'date' }).notNull().defaultNow(),
    languagePreference: varchar('language_preference', { length: 50 }),
    digitalEnrolled: boolean('digital_enrolled').notNull().default(false),
    preferredNotifChannel: varchar('preferred_notif_channel', { length: 50 }),
}, (table) => [
    uniqueIndex('customers_account_number_unique').on(table.accountNumber),
    index('customers_user_id_idx').on(table.userId),
    index('customers_phone_idx').on(table.phone),
    index('customers_email_idx').on(table.email),
]);

/* =========================
   Meters & Readings
========================= */

export const meters = pgTable('meters', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    serialNumber: varchar('serial_number', { length: 100 }).notNull(),
    customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
    meterType: varchar('meter_type', { length: 100 }).notNull(),
    installDate: date('install_date'),
    status: varchar('status', { length: 50 }).notNull().default('active'),
    zone: varchar('zone', { length: 255 }),
    addressJson: jsonb('address_json'),
    manufacturer: varchar('manufacturer', { length: 255 }),
    modelNumber: varchar('model_number', { length: 255 }),
    calibrationDueDate: date('calibration_due_date'),
    nominalFlowRate: numeric('nominal_flow_rate', { precision: 12, scale: 3 }),
}, (table) => [
    uniqueIndex('meters_serial_number_unique').on(table.serialNumber),
    index('meters_customer_id_idx').on(table.customerId),
]);

export const meterReadings = pgTable('meter_readings', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    meterId: integer('meter_id').notNull().references(() => meters.id, { onDelete: 'cascade' }),
    customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
    readingDate: timestamp('reading_date', { mode: 'date' }).notNull(),
    consumptionM3: numeric('consumption_m3', { precision: 14, scale: 3 }).notNull(),
    previousReadingM3: numeric('previous_reading_m3', { precision: 14, scale: 3 }).notNull(),
    currentReadingM3: numeric('current_reading_m3', { precision: 14, scale: 3 }).notNull(),
    readingMethod: varchar('reading_method', { length: 100 }).notNull(),
    readBy: integer('read_by').references(() => users.id, { onDelete: 'set null' }),
    isEstimated: boolean('is_estimated').notNull().default(false),
    anomalyFlag: boolean('anomaly_flag').notNull().default(false),
    anomalyReason: text('anomaly_reason'),
    imagePath: text('image_path'),
}, (table) => [
    index('meter_readings_meter_id_idx').on(table.meterId),
    index('meter_readings_customer_id_idx').on(table.customerId),
    index('meter_readings_read_date_idx').on(table.readingDate),
]);

/* =========================
   Billing
========================= */

export const bills = pgTable('bills', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    billNumber: varchar('bill_number', { length: 100 }).notNull(),
    customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
    meterId: integer('meter_id').references(() => meters.id, { onDelete: 'set null' }),
    billingPeriodFrom: date('billing_period_from').notNull(),
    billingPeriodTo: date('billing_period_to').notNull(),
    issuedDate: date('issued_date').notNull(),
    dueDate: date('due_date').notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    consumptionM3: numeric('consumption_m3', { precision: 14, scale: 3 }).notNull(),
    tariffTier: varchar('tariff_tier', { length: 100 }),
    baseCharge: numeric('base_charge', { precision: 14, scale: 2 }).notNull().default('0'),
    consumptionCharge: numeric('consumption_charge', { precision: 14, scale: 2 }).notNull().default('0'),
    sewerageCharge: numeric('sewerage_charge', { precision: 14, scale: 2 }).notNull().default('0'),
    vat: numeric('vat', { precision: 14, scale: 2 }).notNull().default('0'),
    penalty: numeric('penalty', { precision: 14, scale: 2 }).notNull().default('0'),
    discount: numeric('discount', { precision: 14, scale: 2 }).notNull().default('0'),
    totalAmount: numeric('total_amount', { precision: 14, scale: 2 }).notNull(),
    paidAmount: numeric('paid_amount', { precision: 14, scale: 2 }).notNull().default('0'),
    balance: numeric('balance', { precision: 14, scale: 2 }).notNull(),
    previousBalance: numeric('previous_balance', { precision: 14, scale: 2 }).notNull().default('0'),
    generatedBy: integer('generated_by').references(() => users.id, { onDelete: 'set null' }),
    notes: text('notes'),
}, (table) => [
    uniqueIndex('bills_bill_number_unique').on(table.billNumber),
    index('bills_customer_id_idx').on(table.customerId),
    index('bills_meter_id_idx').on(table.meterId),
    index('bills_due_date_idx').on(table.dueDate),
]);

export const payments = pgTable('payments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    paymentReference: varchar('payment_reference', { length: 100 }).notNull(),
    customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
    billId: integer('bill_id').references(() => bills.id, { onDelete: 'set null' }),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    method: varchar('method', { length: 50 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    transactionId: varchar('transaction_id', { length: 255 }),
    phoneNumber: varchar('phone_number', { length: 50 }),
    cardLast4: varchar('card_last4', { length: 4 }),
    bankRef: varchar('bank_ref', { length: 255 }),
    initiatedAt: timestamp('initiated_at', { mode: 'date' }),
    completedAt: timestamp('completed_at', { mode: 'date' }),
    receiptNumber: varchar('receipt_number', { length: 100 }),
    narration: text('narration'),
    processedBy: integer('processed_by').references(() => users.id, { onDelete: 'set null' }),
}, (table) => [
    uniqueIndex('payments_payment_reference_unique').on(table.paymentReference),
    index('payments_customer_id_idx').on(table.customerId),
    index('payments_bill_id_idx').on(table.billId),
    index('payments_transaction_id_idx').on(table.transactionId),
]);

/* =========================
   Service Requests & Work Orders
========================= */

export const serviceRequests = pgTable('service_requests', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    requestNumber: varchar('request_number', { length: 100 }).notNull(),
    serviceId: integer('service_id').notNull().references(() => services.id, { onDelete: 'restrict' }),
    customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 50 }).notNull(),
    priority: varchar('priority', { length: 50 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    zone: varchar('zone', { length: 255 }),
    addressJson: jsonb('address_json'),
    submittedAt: timestamp('submitted_at', { mode: 'date' }).notNull().defaultNow(),
    acknowledgedAt: timestamp('acknowledged_at', { mode: 'date' }),
    assignedAt: timestamp('assigned_at', { mode: 'date' }),
    resolvedAt: timestamp('resolved_at', { mode: 'date' }),
    closedAt: timestamp('closed_at', { mode: 'date' }),
    assignedTo: integer('assigned_to').references(() => users.id, { onDelete: 'set null' }),
    workOrderId: integer('work_order_id'),
    slaBreached: boolean('sla_breached').notNull().default(false),
    estimatedCompletion: timestamp('estimated_completion', { mode: 'date' }),
}, (table) => [
    uniqueIndex('service_requests_request_number_unique').on(table.requestNumber),
    index('service_requests_service_id_idx').on(table.serviceId),
    index('service_requests_customer_id_idx').on(table.customerId),
    index('service_requests_assigned_to_idx').on(table.assignedTo),
]);

export const requestDocuments = pgTable('request_documents', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    requestId: integer('request_id').notNull().references(() => serviceRequests.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    path: text('path').notNull(),
    uploadedAt: timestamp('uploaded_at', { mode: 'date' }).notNull().defaultNow(),
    uploadedBy: integer('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
}, (table) => [
    index('request_documents_request_id_idx').on(table.requestId),
]);

export const requestStatusHistory = pgTable('request_status_history', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    requestId: integer('request_id').notNull().references(() => serviceRequests.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 50 }).notNull(),
    changedAt: timestamp('changed_at', { mode: 'date' }).notNull().defaultNow(),
    changedBy: integer('changed_by').references(() => users.id, { onDelete: 'set null' }),
    note: text('note'),
}, (table) => [
    index('request_status_history_request_id_idx').on(table.requestId),
]);

export const workOrders = pgTable('work_orders', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    workOrderNumber: varchar('work_order_number', { length: 100 }).notNull(),
    requestId: integer('request_id').references(() => serviceRequests.id, { onDelete: 'set null' }),
    faultReportId: integer('fault_report_id'),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    type: varchar('type', { length: 100 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    priority: varchar('priority', { length: 50 }).notNull(),
    zone: varchar('zone', { length: 255 }),
    addressJson: jsonb('address_json'),
    technicianId: integer('technician_id').references(() => users.id, { onDelete: 'set null' }),
    supervisorId: integer('supervisor_id').references(() => users.id, { onDelete: 'set null' }),
    scheduledDate: date('scheduled_date'),
    scheduledSlot: varchar('scheduled_slot', { length: 100 }),
    startedAt: timestamp('started_at', { mode: 'date' }),
    completedAt: timestamp('completed_at', { mode: 'date' }),
    estimatedHours: numeric('estimated_hours', { precision: 10, scale: 2 }),
    actualHours: numeric('actual_hours', { precision: 10, scale: 2 }),
    labourCost: numeric('labour_cost', { precision: 14, scale: 2 }),
    totalCost: numeric('total_cost', { precision: 14, scale: 2 }),
    completionNotes: text('completion_notes'),
    customerSignature: text('customer_signature'),
}, (table) => [
    uniqueIndex('work_orders_work_order_number_unique').on(table.workOrderNumber),
    index('work_orders_request_id_idx').on(table.requestId),
    index('work_orders_fault_report_id_idx').on(table.faultReportId),
    index('work_orders_technician_id_idx').on(table.technicianId),
    index('work_orders_supervisor_id_idx').on(table.supervisorId),
]);

export const workOrderMaterials = pgTable('work_order_materials', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    workOrderId: integer('work_order_id').notNull().references(() => workOrders.id, { onDelete: 'cascade' }),
    item: varchar('item', { length: 255 }).notNull(),
    quantity: numeric('quantity', { precision: 14, scale: 3 }).notNull(),
    unitCost: numeric('unit_cost', { precision: 14, scale: 2 }).notNull(),
}, (table) => [
    index('work_order_materials_work_order_id_idx').on(table.workOrderId),
]);

export const workOrderPhotos = pgTable('work_order_photos', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    workOrderId: integer('work_order_id').notNull().references(() => workOrders.id, { onDelete: 'cascade' }),
    path: text('path').notNull(),
    uploadedAt: timestamp('uploaded_at', { mode: 'date' }).notNull().defaultNow(),
}, (table) => [
    index('work_order_photos_work_order_id_idx').on(table.workOrderId),
]);

/* =========================
   Faults & Alerts
========================= */

export const faultReports = pgTable('fault_reports', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    faultCode: varchar('fault_code', { length: 100 }).notNull(),
    reportedByCustomerId: integer('reported_by_customer_id').references(() => customers.id, { onDelete: 'set null' }),
    reportedByUserId: integer('reported_by_user_id').references(() => users.id, { onDelete: 'set null' }),
    faultType: varchar('fault_type', { length: 100 }).notNull(),
    description: text('description'),
    zone: varchar('zone', { length: 255 }),
    addressJson: jsonb('address_json'),
    severity: varchar('severity', { length: 50 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    affectedCustomers: integer('affected_customers'),
    workOrderId: integer('work_order_id'),
    reportedAt: timestamp('reported_at', { mode: 'date' }).notNull().defaultNow(),
    acknowledgedAt: timestamp('acknowledged_at', { mode: 'date' }),
    resolvedAt: timestamp('resolved_at', { mode: 'date' }),
    resolutionSummary: text('resolution_summary'),
    nrwImpactM3: numeric('nrw_impact_m3', { precision: 14, scale: 3 }),
}, (table) => [
    uniqueIndex('fault_reports_fault_code_unique').on(table.faultCode),
    index('fault_reports_reported_by_customer_id_idx').on(table.reportedByCustomerId),
    index('fault_reports_reported_by_user_id_idx').on(table.reportedByUserId),
    index('fault_reports_work_order_id_idx').on(table.workOrderId),
]);

export const consumptionAlerts = pgTable('consumption_alerts', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
    meterId: integer('meter_id').notNull().references(() => meters.id, { onDelete: 'cascade' }),
    alertType: varchar('alert_type', { length: 100 }).notNull(),
    detectedAt: timestamp('detected_at', { mode: 'date' }).notNull(),
    consumptionM3: numeric('consumption_m3', { precision: 14, scale: 3 }).notNull(),
    baselineM3: numeric('baseline_m3', { precision: 14, scale: 3 }).notNull(),
    deviationPercent: numeric('deviation_percent', { precision: 8, scale: 2 }).notNull(),
    acknowledged: boolean('acknowledged').notNull().default(false),
    acknowledgedBy: integer('acknowledged_by').references(() => users.id, { onDelete: 'set null' }),
    acknowledgedAt: timestamp('acknowledged_at', { mode: 'date' }),
    workOrderId: integer('work_order_id'),
    message: text('message'),
}, (table) => [
    index('consumption_alerts_customer_id_idx').on(table.customerId),
    index('consumption_alerts_meter_id_idx').on(table.meterId),
    index('consumption_alerts_detected_at_idx').on(table.detectedAt),
]);

/* =========================
   Reference / Config
========================= */

export const services = pgTable('services', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    serviceCode: varchar('service_code', { length: 100 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    nameSw: varchar('name_sw', { length: 255 }),
    department: varchar('department', { length: 255 }),
    description: text('description'),
    module: varchar('module', { length: 100 }),
    icon: varchar('icon', { length: 100 }),
    status: varchar('status', { length: 50 }).notNull().default('active'),
    slaJson: jsonb('sla_json'),
    applicationFee: numeric('application_fee', { precision: 14, scale: 2 }).notNull().default('0'),
    requiresFieldVisit: boolean('requires_field_visit').notNull().default(false),
    selfServiceEligible: boolean('self_service_eligible').notNull().default(false),
    documentsRequiredJson: jsonb('documents_required_json'),
    tagsJson: jsonb('tags_json'),
    ...timestamps,
}, (table) => [
    uniqueIndex('services_service_code_unique').on(table.serviceCode),
    index('services_department_idx').on(table.department),
    index('services_status_idx').on(table.status),
]);

/* =========================
   Relations
========================= */

export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
    modelPermissions: many(modelHasPermissions),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
    customers: many(customers),
    meterReadings: many(meterReadings),
    generatedBills: many(bills),
    processedPayments: many(payments),
    assignedRequests: many(serviceRequests),
    requestStatusChanges: many(requestStatusHistory),
    technicianWorkOrders: many(workOrders),
    supervisedWorkOrders: many(workOrders),
    reportedFaults: many(faultReports),
    acknowledgedAlerts: many(consumptionAlerts),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
    user: one(users, {
        fields: [customers.userId],
        references: [users.id],
    }),
    meters: many(meters),
    meterReadings: many(meterReadings),
    bills: many(bills),
    payments: many(payments),
    serviceRequests: many(serviceRequests),
    faultReportsAsReporter: many(faultReports),
    alerts: many(consumptionAlerts),
}));

export const metersRelations = relations(meters, ({ one, many }) => ({
    customer: one(customers, {
        fields: [meters.customerId],
        references: [customers.id],
    }),
    readings: many(meterReadings),
    bills: many(bills),
    alerts: many(consumptionAlerts),
}));

export const meterReadingsRelations = relations(meterReadings, ({ one }) => ({
    meter: one(meters, {
        fields: [meterReadings.meterId],
        references: [meters.id],
    }),
    customer: one(customers, {
        fields: [meterReadings.customerId],
        references: [customers.id],
    }),
    reader: one(users, {
        fields: [meterReadings.readBy],
        references: [users.id],
    }),
}));

export const billsRelations = relations(bills, ({ one, many }) => ({
    customer: one(customers, {
        fields: [bills.customerId],
        references: [customers.id],
    }),
    meter: one(meters, {
        fields: [bills.meterId],
        references: [meters.id],
    }),
    generatedByUser: one(users, {
        fields: [bills.generatedBy],
        references: [users.id],
    }),
    payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
    customer: one(customers, {
        fields: [payments.customerId],
        references: [customers.id],
    }),
    bill: one(bills, {
        fields: [payments.billId],
        references: [bills.id],
    }),
    processedByUser: one(users, {
        fields: [payments.processedBy],
        references: [users.id],
    }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
    serviceRequests: many(serviceRequests),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one, many }) => ({
    service: one(services, {
        fields: [serviceRequests.serviceId],
        references: [services.id],
    }),
    customer: one(customers, {
        fields: [serviceRequests.customerId],
        references: [customers.id],
    }),
    assignedToUser: one(users, {
        fields: [serviceRequests.assignedTo],
        references: [users.id],
    }),
    documents: many(requestDocuments),
    history: many(requestStatusHistory),
}));

export const requestDocumentsRelations = relations(requestDocuments, ({ one }) => ({
    request: one(serviceRequests, {
        fields: [requestDocuments.requestId],
        references: [serviceRequests.id],
    }),
    uploadedByUser: one(users, {
        fields: [requestDocuments.uploadedBy],
        references: [users.id],
    }),
}));

export const requestStatusHistoryRelations = relations(requestStatusHistory, ({ one }) => ({
    request: one(serviceRequests, {
        fields: [requestStatusHistory.requestId],
        references: [serviceRequests.id],
    }),
    changedByUser: one(users, {
        fields: [requestStatusHistory.changedBy],
        references: [users.id],
    }),
}));

export const workOrdersRelations = relations(workOrders, ({ one, many }) => ({
    request: one(serviceRequests, {
        fields: [workOrders.requestId],
        references: [serviceRequests.id],
    }),
    technician: one(users, {
        fields: [workOrders.technicianId],
        references: [users.id],
    }),
    supervisor: one(users, {
        fields: [workOrders.supervisorId],
        references: [users.id],
    }),
    materials: many(workOrderMaterials),
    photos: many(workOrderPhotos),
}));

export const workOrderMaterialsRelations = relations(workOrderMaterials, ({ one }) => ({
    workOrder: one(workOrders, {
        fields: [workOrderMaterials.workOrderId],
        references: [workOrders.id],
    }),
}));

export const workOrderPhotosRelations = relations(workOrderPhotos, ({ one }) => ({
    workOrder: one(workOrders, {
        fields: [workOrderPhotos.workOrderId],
        references: [workOrders.id],
    }),
}));

export const faultReportsRelations = relations(faultReports, ({ one }) => ({
    reportedByCustomer: one(customers, {
        fields: [faultReports.reportedByCustomerId],
        references: [customers.id],
    }),
    reportedByUser: one(users, {
        fields: [faultReports.reportedByUserId],
        references: [users.id],
    }),
}));

export const consumptionAlertsRelations = relations(consumptionAlerts, ({ one }) => ({
    customer: one(customers, {
        fields: [consumptionAlerts.customerId],
        references: [customers.id],
    }),
    meter: one(meters, {
        fields: [consumptionAlerts.meterId],
        references: [meters.id],
    }),
    acknowledgedByUser: one(users, {
        fields: [consumptionAlerts.acknowledgedBy],
        references: [users.id],
    }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Meter = typeof meters.$inferSelect;
export type NewMeter = typeof meters.$inferInsert;
export type MeterReading = typeof meterReadings.$inferSelect;
export type NewMeterReading = typeof meterReadings.$inferInsert;
export type Bill = typeof bills.$inferSelect;
export type NewBill = typeof bills.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type NewServiceRequest = typeof serviceRequests.$inferInsert;
export type WorkOrder = typeof workOrders.$inferSelect;
export type NewWorkOrder = typeof workOrders.$inferInsert;
export type FaultReport = typeof faultReports.$inferSelect;
export type NewFaultReport = typeof faultReports.$inferInsert;
export type ConsumptionAlert = typeof consumptionAlerts.$inferSelect;
export type NewConsumptionAlert = typeof consumptionAlerts.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
