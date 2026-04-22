import 'dotenv/config';
import {
  and,
  eq,
  desc,
} from 'drizzle-orm';
import { db } from './db';

import {
  roles,
  permissions,
  modelHasRoles,
  modelHasPermissions,
  personalAccessTokens,
  users,
  customers,
  meters,
  meterReadings,
  bills,
  payments,
  services,
  serviceRequests,
  requestDocuments,
  requestStatusHistory,
  workOrders,
  workOrderMaterials,
  workOrderPhotos,
  faultReports,
  consumptionAlerts,
} from './db/schema/';


async function main() {
  console.log('Starting CRUD test...');
  let seed = Math.random().toString(36).substring(2, 8);


  const result = await db.transaction(async (tx) => {
    const createdAt = new Date();

    const [role] = await tx.insert(roles).values({
      name: 'Admin',
      guardName: 'web',
    }).returning();

    const [permission] = await tx.insert(permissions).values({
      name: 'Manage Customers',
      guardName: 'web',
    }).returning();

    const [user] = await tx.insert(users).values({
      employeeId: `EMP-0002${seed}`,
      name: 'Jane Doe',
      email: `jane.doe.${Date.now()}@example.com`,
      phone: '+254700000001',
      roleId: role.id,
      department: 'Operations',
      zone: 'Zone A',
      status: 'active',
      password: 'hashed-password-here',
      mfaSecret: null,
      createdAt,
    }).returning();

    await tx.insert(modelHasRoles).values({
      modelType: 'users',
      modelId: user.id,
      roleId: role.id,
    });

    await tx.insert(modelHasPermissions).values({
      modelType: 'users',
      modelId: user.id,
      permissionId: permission.id,
    });

    const [token] = await tx.insert(personalAccessTokens).values({
      tokenableType: 'users',
      tokenableId: user.id,
      name: 'API Token',
      token: `hashed-token-${Date.now()}`,
      abilities: ['*'],
      lastUsedAt: null,
    }).returning();

    const [customer] = await tx.insert(customers).values({
      accountNumber: `ACC-${Date.now()}`,
      userId: user.id,
      nationalId: '12345678',
      fullName: 'John Customer',
      phone: '+254700000002',
      email: 'john.customer@example.com',
      accountType: 'domestic',
      status: 'active',
      zone: 'Zone A',
      department: 'Water',
      addressJson: { county: 'Machakos', street: 'Main Rd' },
      plotNumber: 'PLOT-12',
      registeredAt: createdAt,
      languagePreference: 'en',
      digitalEnrolled: true,
      preferredNotifChannel: 'sms',
    }).returning();

    const [meter] = await tx.insert(meters).values({
      serialNumber: `MTR-${Date.now()}`,
      customerId: customer.id,
      meterType: 'smart',
      installDate: new Date('2025-01-01'),
      status: 'active',
      zone: 'Zone A',
      addressJson: { lat: -1.234, lng: 36.789 },
      manufacturer: 'Acme Meters',
      modelNumber: 'X100',
      calibrationDueDate: new Date('2027-01-01'),
      nominalFlowRate: '2.500',
    }).returning();

    const [reading] = await tx.insert(meterReadings).values({
      meterId: meter.id,
      customerId: customer.id,
      readingDate: createdAt,
      consumptionM3: '12.500',
      previousReadingM3: '100.000',
      currentReadingM3: '112.500',
      readingMethod: 'manual',
      readBy: user.id,
      isEstimated: false,
      anomalyFlag: false,
      anomalyReason: null,
      imagePath: '/uploads/readings/reading-1.jpg',
    }).returning();

    const [service] = await tx.insert(services).values({
      serviceCode: `SRV-002${seed}`,
      name: 'Leak Repair',
      nameSw: 'Matengenezo ya uvujaji',
      department: 'Operations',
      description: 'Repair of customer pipe leaks',
      module: 'field-service',
      icon: 'wrench',
      status: 'active',
      slaJson: { responseHours: 24, resolutionHours: 72 },
      applicationFee: '250.00',
      requiresFieldVisit: true,
      selfServiceEligible: false,
      documentsRequiredJson: ['id', 'proof_of_ownership'],
      tagsJson: ['leak', 'repair'],
      createdAt,
      createdAt,
    }).returning();

    const [serviceNew] = await tx.insert(services).values({
      serviceCode: `${seed}NCWSC-REC-001`,
      name: "Reconnection After Disconnection",
      nameSw: "Ombi la Kuunganishwa Tena Baada ya Kukatwa",
      department: "Revenue & Collections",
      description: "Reinstate water supply that was disconnected due to non-payment or violation. Requires outstanding balance settlement and reconnection fee payment before field visit.",
      module: "Service Request Management",
      icon: "🔄",
      status: "active",
      slaJson: { acknowledgementHours: 4, resolutionHours: 24, escalationHours: 12, priority: "high" },
      applicationFee: '1500.00',
      requiresFieldVisit: true,
      selfServiceEligible: true,
      documentsRequiredJson: ["Payment receipt for outstanding bill", "Reconnection fee receipt"],
      tagsJson: ["reconnection", "billing", "revenue"],
      createdAt,
      createdAt,
    }).returning();

    const [serviceRequest] = await tx.insert(serviceRequests).values({
      requestNumber: `SR-${Date.now()}`,
      serviceId: service.id,
      customerId: customer.id,
      status: 'submitted',
      priority: 'high',
      title: 'Water leak at compound',
      description: 'Visible leak near gate.',
      zone: 'Zone A',
      addressJson: { landmark: 'Near school' },
      submittedAt: createdAt,
      acknowledgedAt: null,
      assignedAt: null,
      resolvedAt: null,
      closedAt: null,
      assignedTo: user.id,
      workOrderId: null,
      slaBreached: false,
      estimatedCompletion: new Date(Date.now() + 72 * 60 * 60 * 1000),
    }).returning();

    const [serviceRequestNew] = await tx.insert(serviceRequests).values({
      requestNumber: `SR-${Date.now()}`,
      serviceId: serviceNew.id,
      customerId: customer.id,
      status: 'submitted',
      priority: 'high',
      title: 'Water leak at compound',
      description: 'Visible leak near gate.',
      zone: 'Zone A',
      addressJson: { landmark: 'Near school' },
      submittedAt: createdAt,
      acknowledgedAt: null,
      assignedAt: null,
      resolvedAt: null,
      closedAt: null,
      assignedTo: user.id,
      workOrderId: null,
      slaBreached: false,
      estimatedCompletion: new Date(Date.now() + 72 * 60 * 60 * 1000),
    }).returning();


    await tx.insert(requestDocuments).values({
      requestId: serviceRequest.id,
      name: 'photo-1.jpg',
      path: '/uploads/requests/photo-1.jpg',
      uploadedAt: createdAt,
      uploadedBy: user.id,
    });

    await tx.insert(requestStatusHistory).values({
      requestId: serviceRequest.id,
      status: 'submitted',
      changedAt: createdAt,
      changedBy: user.id,
      note: 'Request created',
    });

    const [fault] = await tx.insert(faultReports).values({
      faultCode: `FLT-${Date.now()}`,
      reportedByCustomerId: customer.id,
      reportedByUserId: null,
      faultType: 'Leak',
      description: 'Customer reported leak.',
      zone: 'Zone A',
      addressJson: { street: 'Main Rd' },
      severity: 'medium',
      status: 'open',
      affectedCustomers: 1,
      workOrderId: null,
      reportedAt: createdAt,
      acknowledgedAt: null,
      resolvedAt: null,
      resolutionSummary: null,
      nrwImpactM3: '0.500',
    }).returning();

    const [workOrder] = await tx.insert(workOrders).values({
      workOrderNumber: `WO-${Date.now()}`,
      requestId: serviceRequest.id,
      faultReportId: fault.id,
      title: 'Investigate leak',
      description: 'Inspect and repair leak.',
      type: 'repair',
      status: 'scheduled',
      priority: 'high',
      zone: 'Zone A',
      addressJson: { street: 'Main Rd' },
      technicianId: user.id,
      supervisorId: user.id,
      scheduledDate: new Date('2026-04-22'),
      scheduledSlot: 'morning',
      startedAt: null,
      completedAt: null,
      estimatedHours: '4.00',
      actualHours: null,
      labourCost: '1000.00',
      totalCost: '1250.00',
      completionNotes: null,
      customerSignature: null,
    }).returning();

    await tx.update(serviceRequests).set({
      workOrderId: workOrder.id,
      assignedAt: createdAt,
      status: 'assigned',
    }).where(eq(serviceRequests.id, serviceRequest.id));

    await tx.insert(workOrderMaterials).values({
      workOrderId: workOrder.id,
      item: 'Pipe connector',
      quantity: '2',
      unitCost: '150.00',
    });

    await tx.insert(workOrderPhotos).values({
      workOrderId: workOrder.id,
      path: '/uploads/work-orders/wo-1.jpg',
      uploadedAt: createdAt,
    });

    const [bill] = await tx.insert(bills).values({
      billNumber: `BILL-${Date.now()}`,
      customerId: customer.id,
      meterId: meter.id,
      billingPeriodFrom: new Date('2026-03-01'),
      billingPeriodTo: new Date('2026-03-31'),
      issuedDate: new Date('2026-04-01'),
      dueDate: new Date('2026-04-15'),
      status: 'unpaid',
      consumptionM3: '12.500',
      tariffTier: 'tier-1',
      baseCharge: '100.00',
      consumptionCharge: '250.00',
      sewerageCharge: '20.00',
      vat: '37.20',
      penalty: '0.00',
      discount: '0.00',
      totalAmount: '407.20',
      paidAmount: '0.00',
      balance: '407.20',
      previousBalance: '0.00',
      generatedBy: user.id,
      notes: 'Monthly bill',
    }).returning();

    const [payment] = await tx.insert(payments).values({
      paymentReference: `PAY-${Date.now()}`,
      customerId: customer.id,
      billId: bill.id,
      amount: '407.20',
      method: 'mpesa',
      status: 'completed',
      transactionId: `TX-${Date.now()}`,
      phoneNumber: '+254700000002',
      cardLast4: null,
      bankRef: null,
      initiatedAt: createdAt,
      completedAt: createdAt,
      receiptNumber: `RCPT-${Date.now()}`,
      narration: 'Bill settlement',
      processedBy: user.id,
    }).returning();

    await tx.insert(consumptionAlerts).values({
      customerId: customer.id,
      meterId: meter.id,
      alertType: 'high_consumption',
      detectedAt: createdAt,
      consumptionM3: '30.000',
      baselineM3: '12.500',
      deviationPercent: '140.00',
      acknowledged: true,
      acknowledgedBy: user.id,
      acknowledgedAt: createdAt,
      workOrderId: workOrder.id,
      message: 'Consumption spike detected',
    });

    const customerWithRelations = await tx.query.customers.findFirst({
      where: eq(customers.id, customer.id),
      with: {
        meters: true,
        bills: true,
        payments: true,
        serviceRequests: {
          with: {
            documents: true,
            history: true,
          },
        },
      },
    });

    const billUpdate = await tx.update(bills)
        .set({
          status: 'paid',
          paidAmount: '407.20',
          balance: '0.00',
        })
        .where(eq(bills.id, bill.id))
        .returning();

    const paymentRead = await tx.query.payments.findFirst({
      where: eq(payments.id, payment.id),
    });

    // await tx.delete(workOrderMaterials).where(eq(workOrderMaterials.workOrderId, workOrder.id));
    // await tx.delete(workOrderPhotos).where(eq(workOrderPhotos.workOrderId, workOrder.id));
    // await tx.delete(consumptionAlerts).where(eq(consumptionAlerts.customerId, customer.id));
    // await tx.delete(requestDocuments).where(eq(requestDocuments.requestId, serviceRequest.id));
    // await tx.delete(requestStatusHistory).where(eq(requestStatusHistory.requestId, serviceRequest.id));
    // await tx.delete(payments).where(eq(payments.id, payment.id));
    // await tx.delete(bills).where(eq(bills.id, bill.id));
    // await tx.delete(workOrders).where(eq(workOrders.id, workOrder.id));
    // await tx.delete(serviceRequests).where(eq(serviceRequests.id, serviceRequest.id));
    // await tx.delete(faultReports).where(eq(faultReports.id, fault.id));
    // await tx.delete(meterReadings).where(eq(meterReadings.id, reading.id));
    // await tx.delete(meters).where(eq(meters.id, meter.id));
    // await tx.delete(customers).where(eq(customers.id, customer.id));
    // await tx.delete(personalAccessTokens).where(eq(personalAccessTokens.id, token.id));
    // await tx.delete(modelHasPermissions).where(and(eq(modelHasPermissions.modelType, 'users'), eq(modelHasPermissions.modelId, user.id)));
    // await tx.delete(modelHasRoles).where(and(eq(modelHasRoles.modelType, 'users'), eq(modelHasRoles.modelId, user.id)));
    // await tx.delete(users).where(eq(users.id, user.id));
    // await tx.delete(permissions).where(eq(permissions.id, permission.id));
    // await tx.delete(roles).where(eq(roles.id, role.id));
    // await tx.delete(services).where(eq(services.id, service.id));

    return {
      role,
      permission,
      user,
      customer,
      meter,
      reading,
      service,
      serviceNew,
      serviceRequest,
      serviceRequestNew,
      fault,
      workOrder,
      bill,
      payment,
      customerWithRelations,
      billUpdate,
      paymentRead,
    };
  });

  console.log('CRUD test completed successfully');
  console.dir(result, { depth: null });
}

main().catch((error) => {
  console.error('CRUD test failed');
  console.error(error);
  process.exit(1);
});