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

interface ChartData {
  name: string;
  value: number;
}

interface MonthlyData {
  month: string;
  amount: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9C27B0", "#E91E63"];

export default function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0]
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
    } catch (err) {
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
      setForm({ title: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      toast.error("Failed to save expense");
    }
  };

  const handleEdit = (exp: Expense) => {
    setForm({
      title: exp.title,
      amount: String(exp.amount),
      category: exp.category,
      date: exp.date?.split("T")[0] || new Date().toISOString().split('T')[0],
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
    } catch (err) {
      toast.error("Failed to delete expense");
    }
  };

  const categoryData = expenses.reduce((acc: ChartData[], curr) => {
    const existing = acc.find(x => x.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const monthlyData = expenses.reduce((acc: MonthlyData[], curr) => {
    const month = new Date(curr.date).toLocaleString("default", { 
      month: "short", 
      year: "numeric" 
    });
    const existing = acc.find(x => x.month === month);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ month, amount: curr.amount });
    }
    return acc;
  }, []).sort((a: MonthlyData, b: MonthlyData) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  );

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

      <div className="dashboard-content">
        <section className="form-section">
          <h3>{editingId ? "Edit Expense" : "Add New Expense"}</h3>
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-group">
              <label>Title</label>
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="Dinner, Rent, etc." 
                required 
              />
            </div>
            <div className="form-group">
              <label>Amount ($)</label>
              <input 
                name="amount" 
                type="number" 
                value={form.amount} 
                onChange={handleChange} 
                placeholder="0.00" 
                min="0.01" 
                step="0.01" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                placeholder="Food, Transportation, etc." 
                required 
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input 
                name="date" 
                type="date" 
                value={form.date} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingId ? "Update Expense" : "Add Expense"}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="secondary-btn"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ 
                      title: "", 
                      amount: "", 
                      category: "", 
                      date: new Date().toISOString().split('T')[0] 
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="charts-section">
          <div className="chart-container">
            <h3>Spending by Category</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={categoryData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  >
                   {categoryData.map((_: ChartData, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-container">
            <h3>Monthly Spending</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Total"]} />
                  <Legend />
                  <Bar dataKey="amount" name="Monthly Total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="transactions-section">
          <h3>Recent Transactions</h3>
          {isLoading ? (
            <p>Loading transactions...</p>
          ) : expenses.length === 0 ? (
            <p>No transactions found. Add your first expense!</p>
          ) : (
            <div className="transactions-list">
              {expenses.slice(0, 5).map((exp) => (
                <div key={exp.id} className="transaction-item">
                  <div className="transaction-info">
                    <span className="transaction-category">{exp.category}</span>
                    <span className="transaction-title">{exp.title}</span>
                    <span className="transaction-date">
                      {new Date(exp.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="transaction-amount">
                    ${exp.amount.toFixed(2)}
                  </div>
                  <div className="transaction-actions">
                    <button 
                      onClick={() => handleEdit(exp)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(exp.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}