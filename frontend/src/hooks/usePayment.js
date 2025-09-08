// src/hooks/usePayments.js
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const getConfig = () => ({
        withCredentials: true,
    });

  // POST /payments/checkout
  const checkoutPayment = async (enrollment_id, amount) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("/api/v1/payment/payments/checkout", {
        enrollment_id,
        amount
      }, getConfig());
      toast.success("Checkout berhasil!");
      return res.data; // { token, redirect_url }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast.error(`Checkout gagal: ${msg}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET /payments/:id
  const getPaymentDetail = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/payments/${id}`, getConfig());
      toast.success("Detail pembayaran berhasil diambil!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast.error(`Gagal ambil detail pembayaran: ${msg}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // POST /payments/notification
  const sendPaymentNotification = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("/api/v1/payment/payments/notification", payload);
      toast.success("Notifikasi pembayaran diproses!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast.error(`Notifikasi gagal: ${msg}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkoutPayment,
    getPaymentDetail,
    sendPaymentNotification,
  };
}
