import midtransClient from "midtrans-client";
import { PaymentModel } from "../models/Payment.js";
import { EnrollmentModel } from "../models/Enrollment.js";

// Konfigurasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// 1. Checkout
export const checkoutPayment = async (req, res) => {
  try {
    const { enrollment_id, amount } = req.body;

    // Generate order_id unik (misal: order-<timestamp>)
    const order_id = `order-${Date.now()}`;

    const Enrollment = await EnrollmentModel.findById(enrollment_id);
    if (!Enrollment) {
      return res.status(404).json({ success: false, message: "Enroll not found" });
    }

    const payment = await PaymentModel.create({
      enrollment_id,
      order_id,
      amount,
      status: "pending"
    });

    let parameter = {
      item_detail: {
        Enrollment,
      },
      transaction_details: {
        order_id: order_id,
        gross_amount: amount
      }
    };

    const transaction = await snap.createTransaction(parameter);

    return res.status(201).json({
      success: true,
      token: transaction.token,
      payment
    });
  } catch (error) {
    console.error("Error in createPayment:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 2. Get Payment Detail
export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await PaymentModel.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    return res.json({ success: true, payment });
  } catch (error) {
    console.error("Error in getPayment:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 3. Handle Midtrans Notification
export const notificationHandler = async (req, res) => {
  try {
    const notification = req.body;

    // ✅ verifikasi notifikasi ke Midtrans
    const statusResponse = await snap.transaction.notification(notification);

    const { order_id, transaction_status, payment_type, fraud_status } = statusResponse;

    let paymentStatus = "pending";
    let enrollmentStatus = "pending";

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        paymentStatus = "success";
        enrollmentStatus = "active";
      } else {
        paymentStatus = "challenge";
        enrollmentStatus = "pending";
      }
    } else if (transaction_status === "settlement") {
      paymentStatus = "success";
      enrollmentStatus = "active";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "expire" ||
      transaction_status === "cancel"
    ) {
      paymentStatus = "failed";
      enrollmentStatus = "pending"; // atau bisa "inactive"
    }

    // Update Payment
    const payment = await PaymentModel.updateStatus(order_id, paymentStatus, payment_type);

    // Update Enrollment kalau payment ditemukan
    let enrollment = null;
    if (payment?.enrollment_id) {
      enrollment = await EnrollmentModel.updateStatus(payment.enrollment_id, enrollmentStatus);
    }

    return res.json({ success: true, payment, enrollment });
  } catch (error) {
    console.error("Error in notificationHandler:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getCourse = async (req, res) => {
  try {
    // const { id } = req.params;
    const {enrollment_id} = req.body
    const course = await EnrollmentModel.findById(enrollment_id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    return res.json({ success: true, course });
  } catch (error) {
    console.error("Error in getPayment:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
