import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts";
import "../styles/dashboard.css";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9C27B0", "#E91E63"];

export default function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch {
      toast.error("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchExpenses();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/expenses/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Expense updated successfully");
      } else {
        await axios.post("/expenses", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Expense added successfully");
      }
      setForm({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
      setEditingId(null);
      fetchExpenses();
    } catch {
      toast.error("Failed to save expense");
    }
  };

  const handleEdit = (exp: Expense) => {
    setForm({
      title: exp.title,
      amount: String(exp.amount),
      category: exp.category,
      date: exp.date?.split("T")[0] || new Date().toISOString().split("T")[0],
    });
    setEditingId(exp.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  const categoryData = expenses.reduce((acc: { name: string; value: number }[], curr) => {
    const existing = acc.find((x) => x.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const monthlyData = expenses
    .reduce((acc: { month: string; amount: number }[], curr) => {
      const month = new Date(curr.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      const existing = acc.find((x) => x.month === month);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({ month, amount: curr.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => {
      const aDate = new Date(a.month + " 1");
      const bDate = new Date(b.month + " 1");
      return aDate.getTime() - bDate.getTime();
    });

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome back, {user?.name}</h2>
        <div className="stats-summary">
          <div className="stat-card">
            <h3>Total Expenses</h3>
            <p>${totalSpent.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Transactions</h3>
            <p>{expenses.length}</p>
          </div>
          <div className="stat-card">
            <h3>Categories</h3>
            <p>{categoryData.length}</p>
          </div>
        </div>
      </header>

      <section className="form-section">
        <form onSubmit={handleSubmit} className="expense-form">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="amount" placeholder="Amount" type="number" value={form.amount} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
          <button type="submit">{editingId ? "Update" : "Add"}</button>
        </form>
      </section>

      <section className="charts-section">
        <div className="chart-container">
          <h3>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Monthly Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
