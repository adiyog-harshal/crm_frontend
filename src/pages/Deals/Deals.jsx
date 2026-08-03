import React, { useState, useEffect, useRef } from 'react';
import './Deals.css';
import { IndianRupee, TrendingUp, Plus, Search, X, Mail, Phone, Building2, Calendar, FileText, Check, Download, Edit3, Trash2, MoreVertical, Briefcase, FileDown, CheckCircle, Clock, Printer, Eye, User } from "lucide-react";
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';

const STAGES = ["New", "Contacted", "Qualified", "Unqualified", "Negotiation", "Won"];

const STAGE_PROBABILITIES = {
  "New": 20,
  "Contacted": 40,
  "Qualified": 60,
  "Unqualified": 0,
  "Negotiation": 80,
  "Won": 100
};

const STAGE_COLORS = {
  "New": "#3b82f6",          // Blue
  "Contacted": "#06b6d4",    // Cyan
  "Qualified": "#8b5cf6",    // Purple
  "Unqualified": "#64748b",  // Slate
  "Negotiation": "#f59e0b",  // Amber
  "Won": "#10b981"           // Emerald
};

const INITIAL_DEALS = [
  { id: 1, title: "Acme Corp Cloud Migration", company: "Acme Corp", contact: "John Doe", phone: "+91 98765 43210", email: "johndoe@acme.com", value: 45000, stage: "New", probability: 20, date: "2026-07-10" },
  { id: 2, title: "Bharat Petroleum ERP Upgrade", company: "Bharat Petroleum", contact: "Rajesh Kumar", phone: "+91 99887 76655", email: "rajesh@bpcl.in", value: 95000, stage: "Contacted", probability: 40, date: "2026-07-12" },
  { id: 3, title: "Tata Steel Predictive Analytics", company: "Tata Steel", contact: "Amit Sharma", phone: "+91 91234 56789", email: "amit.sharma@tatasteel.com", value: 60000, stage: "Negotiation", probability: 80, date: "2026-07-13" },
  { id: 4, title: "HDFC Bank Security Suite", company: "HDFC Bank", contact: "Neha Gupta", phone: "+91 98761 23456", email: "neha.gupta@hdfcbank.com", value: 120000, stage: "Qualified", probability: 60, date: "2026-07-08" },
  { id: 5, title: "Zomato Logistics Routing", company: "Zomato", contact: "Vikram Sen", phone: "+91 95432 10987", email: "vikram.sen@zomato.com", value: 25000, stage: "Unqualified", probability: 0, date: "2026-07-11" },
  { id: 6, title: "Infosys Training Portal", company: "Infosys", contact: "Sanjay Rao", phone: "+91 91122 33445", email: "sanjay_rao@infosys.com", value: 18000, stage: "Won", probability: 100, date: "2026-07-14" },
  { id: 7, title: "Swiggy Ads Integration", company: "Swiggy", contact: "Divya Patel", phone: "+91 90001 20002", email: "divya.patel@swiggy.com", value: 35000, stage: "Negotiation", probability: 80, date: "2026-07-15" }
];

const Deals = () => {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDragStage, setActiveDragStage] = useState(null);
  
  // Modals States
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'call' | 'meeting' | 'proposal' | 'quote' | 'invoice'
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Form States
  const [dealForm, setDealForm] = useState({ title: "", company: "", contact: "", phone: "", email: "", value: "", stage: "New", probability: 20 });
  const [callForm, setCallForm] = useState({ date: "", time: "", agenda: "" });
  const [meetingForm, setMeetingForm] = useState({ date: "", time: "", location: "Zoom", purpose: "" });
  const [proposalText, setProposalText] = useState("");

  const dropdownRef = useRef(null);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (activeDropdownId !== null && dropdownRef.current) {
        if (!dropdownRef.current.contains(e.target) && !e.target.closest('.kebab-btn')) {
          setActiveDropdownId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [activeDropdownId]);

  // Statistics
  const totalDealsCount = deals.length;
  const totalValue = deals.reduce((acc, deal) => acc + deal.value, 0);
  const wonValue = deals.filter(d => d.stage === "Won").reduce((acc, d) => acc + d.value, 0);
  const pipelineValue = deals.filter(d => d.stage !== "Won" && d.stage !== "Unqualified").reduce((acc, d) => acc + d.value, 0);
  const winRate = totalDealsCount > 0 
    ? Math.round((deals.filter(d => d.stage === "Won").length / totalDealsCount) * 100) 
    : 0;

  const stats = [
    { title: "Total Value", value: `₹${totalValue.toLocaleString()}`, sub: `${totalDealsCount} Active Deals`, icon: <IndianRupee size={24} />, color: "#1e293b" },
    { title: "Pipeline Value", value: `₹${pipelineValue.toLocaleString()}`, sub: "Weighted Forecast", icon: <TrendingUp size={24} />, color: "#1e293b" },
    { title: "Closed Won", value: `₹${wonValue.toLocaleString()}`, sub: "Revenue Generated", icon: <CheckCircle size={24} />, color: "#1e293b" },
    { title: "Win Rate", value: `${winRate}%`, sub: "Based on Deal Stages", icon: <Briefcase size={24} />, color: "#1e293b" }
  ];

  // Drag and Drop Logic
  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData("text/plain", dealId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    if (activeDragStage !== stage) {
      setActiveDragStage(stage);
    }
  };

  const handleDragLeave = () => {
    setActiveDragStage(null);
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    setActiveDragStage(null);
    const dealId = Number(e.dataTransfer.getData("text/plain"));
    if (isNaN(dealId)) return;

    setDeals(prevDeals =>
      prevDeals.map(deal =>
        deal.id === dealId
          ? { ...deal, stage: targetStage, probability: STAGE_PROBABILITIES[targetStage] }
          : deal
      )
    );
  };

  // Add/Edit Handlers
  const openAddModal = () => {
    setDealForm({ title: "", company: "", contact: "", phone: "", email: "", value: "", stage: "New", probability: 20 });
    setActiveModal("add");
  };

  const openEditModal = (deal) => {
    setSelectedDeal(deal);
    setDealForm({
      title: deal.title,
      company: deal.company,
      contact: deal.contact,
      phone: deal.phone || "",
      email: deal.email || "",
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability
    });
    setActiveModal("edit");
    setActiveDropdownId(null);
  };

  const handleDealFormSubmit = (e) => {
    e.preventDefault();
    if (!dealForm.title || !dealForm.company || !dealForm.value) return;

    const val = Number(dealForm.value);
    if (isNaN(val)) return;

    if (activeModal === "add") {
      const newDeal = {
        id: Date.now(),
        title: dealForm.title,
        company: dealForm.company,
        contact: dealForm.contact || "Unknown",
        phone: dealForm.phone || "",
        email: dealForm.email || "",
        value: val,
        stage: dealForm.stage,
        probability: dealForm.probability,
        date: new Date().toISOString().split('T')[0]
      };
      setDeals(prev => [newDeal, ...prev]);
    } else if (activeModal === "edit" && selectedDeal) {
      setDeals(prev =>
        prev.map(d =>
          d.id === selectedDeal.id
            ? { ...d, ...dealForm, value: val }
            : d
        )
      );
    }
    setActiveModal(null);
    setSelectedDeal(null);
  };

  const handleDeleteDeal = (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      setDeals(prev => prev.filter(d => d.id !== dealId));
    }
    setActiveDropdownId(null);
  };

  // Quick Action Modals
  const openActionModal = (deal, action) => {
    setSelectedDeal(deal);
    setActiveModal(action);
    setActiveDropdownId(null);

    // Initial values based on action
    if (action === "call") {
      setCallForm({ date: "", time: "", agenda: `Call with ${deal.contact} from ${deal.company}` });
    } else if (action === "meeting") {
      setMeetingForm({ date: "", time: "", location: "Zoom", purpose: `Project demo with ${deal.company}` });
    } else if (action === "proposal") {
      setProposalText(`Dear ${deal.contact},\n\nWe are pleased to submit our proposal for "${deal.title}" valued at ₹${deal.value.toLocaleString()}.\n\nLooking forward to working with ${deal.company}.\n\nBest regards,\nSanket Baghel`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "ID,Deal Title,Company,Contact Person,Phone Number,Email,Value (₹),Stage,Probability (%),Date Created\n";
    const rows = deals.map(d => 
      `"${d.id}","${d.title.replace(/"/g, '""')}","${d.company.replace(/"/g, '""')}","${d.contact.replace(/"/g, '""')}","${(d.phone || "").replace(/"/g, '""')}","${(d.email || "").replace(/"/g, '""')}","${d.value}","${d.stage}","${d.probability}","${d.date}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Adiyog_CRM_Deals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print PDF
  const handlePrintPDF = () => {
    window.print();
  };

  // Action Submission Mimics
  const triggerCallSchedule = (e) => {
    e.preventDefault();
    alert(`Success: Call scheduled on ${callForm.date} at ${callForm.time} for "${selectedDeal.title}"`);
    setActiveModal(null);
  };

  const triggerMeetingBook = (e) => {
    e.preventDefault();
    alert(`Success: Meeting booked on ${meetingForm.date} at ${meetingForm.time} via ${meetingForm.location}`);
    setActiveModal(null);
  };

  const triggerSendProposal = () => {
    alert(`Success: Proposal sent to ${selectedDeal.contact} (${selectedDeal.company}) for ₹${selectedDeal.value.toLocaleString()}`);
    setActiveModal(null);
  };

  // this code is for Document downloads 
  const handleDownloadDoc = (type) => {
    const title =  'INVOICE';
    const num = Math.floor(1000 + Math.random() * 9000);
    const content = `=========================================
          ADIYOG CRM - ${title}
          =========================================
          Doc Number: ${type.toUpperCase().substring(0, 3)}-${num}
          Date: ${new Date().toISOString().split('T')[0]}

          DEAL DETAILS:
          Title: ${selectedDeal.title}
          Company: ${selectedDeal.company}
          Primary Contact: ${selectedDeal.contact}

          FINANCIAL DATA:
          Subtotal: ₹${selectedDeal.value.toLocaleString()}.00
          Tax (18%): ₹${(selectedDeal.value * 0.18).toLocaleString()}.00
          -----------------------------------------
          TOTAL DUE: ₹${(selectedDeal.value * 1.18).toLocaleString()}.00

          Status: Generated via Pipeline Board
          =========================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${title.toLowerCase()}_${selectedDeal.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setActiveModal(null);
  };

  // Filter deals by search
  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="deals-page-container">
      {/* Top Action Header */}
      <div className="deals-page-header">
        <div>
          <h2>Deals Pipeline</h2>
          <p>Drag and drop deals between columns to update their stages</p>
        </div>
        <div className="header-actions">
          <SearchInput
            placeholder="Search deals, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="deals-search"
          />
          <Button
            variant="success"
            icon={<Download size={16} />}
            onClick={handleExportCSV}
            title="Export Excel (CSV)"
            className="deals-export-btn"
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            icon={<Printer size={16} />}
            onClick={handlePrintPDF}
            title="Print/Export PDF"
            className="deals-print-btn"
          >
            Print Board
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={openAddModal}
            className="add-deal-btn"
          >
            Add Deal
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="deals-stats-grid">
        {stats.map((item, index) => (
          <div className="deals-stat-card" key={index}>
            <div className="deals-stat-icon" style={{ background: item.color }}>
              {item.icon}
            </div>
            <div className="deals-stat-content">
              <p>{item.title}</p>
              <h2>{item.value}</h2>
              <span>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {STAGES.map((stage) => {
          const stageDeals = filteredDeals.filter((deal) => deal.stage === stage);
          const stageSum = stageDeals.reduce((sum, d) => sum + d.value, 0);
          const isDraggingOver = activeDragStage === stage;

          return (
            <div
              key={stage}
              className={`kanban-column ${isDraggingOver ? "drag-over" : ""}`}
              style={{
                borderTopColor: STAGE_COLORS[stage],
                backgroundColor: isDraggingOver ? `${STAGE_COLORS[stage]}08` : `${STAGE_COLORS[stage]}02`
              }}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="column-header" style={{ borderTopColor: STAGE_COLORS[stage] }}>
                <div className="header-title-group">
                  <span className="stage-dot" style={{ background: STAGE_COLORS[stage] }}></span>
                  <h3>{stage}</h3>
                  <span className="count-badge">{stageDeals.length}</span>
                </div>
                <div className="column-total">
                  ₹{stageSum.toLocaleString()}
                </div>
              </div>

              <div className="column-body">
                {stageDeals.length === 0 ? (
                  <div className="empty-column-placeholder">
                    <span>No Deals</span>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="deal-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                    >
                      <div className="deal-card-header">
                        <span className="deal-company">{deal.company}</span>
                        <div className="card-kebab-container">
                          <button
                            className="kebab-btn"
                            onClick={() => setActiveDropdownId(activeDropdownId === deal.id ? null : deal.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {activeDropdownId === deal.id && (
                            <div className="card-action-dropdown" ref={dropdownRef}>
                              <button onClick={() => openActionModal(deal, "view")}>
                                <Eye size={14} />
                                <span>See Details</span>
                              </button>
                              <button onClick={() => openEditModal(deal)}>
                                <Edit3 size={14} />
                                <span>Edit Deal</span>
                              </button>
                              <button onClick={() => openActionModal(deal, "call")}>
                                <Phone size={14} />
                                <span>Schedule Call</span>
                              </button>
                              <button onClick={() => openActionModal(deal, "meeting")}>
                                <Calendar size={14} />
                                <span>Book Meeting</span>
                              </button>
                              <button onClick={() => openActionModal(deal, "proposal")}>
                                <Mail size={14} />
                                <span>Send Proposal</span>
                              </button>
                              <button onClick={() => openActionModal(deal, "invoice")}>
                                <FileDown size={14} />
                                <span>Generate Invoice</span>
                              </button>
                              <div className="dropdown-divider"></div>
                              <button className="dropdown-delete-btn" onClick={() => handleDeleteDeal(deal.id)}>
                                <Trash2 size={14} />
                                <span>Delete Deal</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <h4 className="deal-title">{deal.title}</h4>

                      {(deal.contact || deal.phone || deal.email) && (
                        <div className="deal-card-contact-info">
                          {deal.contact && (
                            <span className="deal-contact-name" title="Contact Person">
                              <User size={12} /> {deal.contact}
                            </span>
                          )}
                          {deal.phone && (
                            <span className="deal-contact-phone" title="Phone Number">
                              <Phone size={12} /> {deal.phone}
                            </span>
                          )}
                          {deal.email && (
                            <span className="deal-contact-email" title="Email Address">
                              <Mail size={12} /> {deal.email}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="deal-card-footer">
                        <div className="deal-val-container">
                          <span className="deal-val-label">Value</span>
                          <span className="deal-val-amount">₹{deal.value.toLocaleString()}</span>
                        </div>
                        <div className="deal-prob-badge" style={{ background: `${STAGE_COLORS[stage]}15`, color: STAGE_COLORS[stage] }}>
                          {deal.probability}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODALS OVERLAYS ================= */}

      {/* Add / Edit Deal Modal */}
      {(activeModal === 'add' || activeModal === 'edit') && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{activeModal === 'add' ? 'Create New Deal' : 'Edit Deal Details'}</h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleDealFormSubmit}>
              <div className="form-group">
                <label>Deal Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp Enterprise License"
                  value={dealForm.title}
                  onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={dealForm.company}
                    onChange={(e) => setDealForm({ ...dealForm, company: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Primary Contact</label>
                  <input
                    type="text"
                    placeholder="Contact Person name"
                    value={dealForm.contact}
                    onChange={(e) => setDealForm({ ...dealForm, contact: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={dealForm.phone}
                    onChange={(e) => setDealForm({ ...dealForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    placeholder="e.g. contact@company.com"
                    value={dealForm.email}
                    onChange={(e) => setDealForm({ ...dealForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Deal Value (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={dealForm.value}
                    onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Stage</label>
                  <select
                    value={dealForm.stage}
                    onChange={(e) => setDealForm({ 
                      ...dealForm, 
                      stage: e.target.value,
                      probability: STAGE_PROBABILITIES[e.target.value]
                    })}
                  >
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Probability ({dealForm.probability}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dealForm.probability}
                  onChange={(e) => setDealForm({ ...dealForm, probability: Number(e.target.value) })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-save">
                  {activeModal === 'add' ? 'Add Deal' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Call Modal */}
      {activeModal === 'call' && selectedDeal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Schedule Call: {selectedDeal.company}</h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={triggerCallSchedule}>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Date</label>
                  <input
                    type="date"
                    value={callForm.date}
                    onChange={(e) => setCallForm({ ...callForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Time</label>
                  <input
                    type="time"
                    value={callForm.time}
                    onChange={(e) => setCallForm({ ...callForm, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Call Agenda</label>
                <textarea
                  rows="3"
                  value={callForm.agenda}
                  onChange={(e) => setCallForm({ ...callForm, agenda: e.target.value })}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-save btn-call">
                  <Phone size={14} style={{ marginRight: '6px' }} />
                  <span>Schedule Call</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Meeting Modal */}
      {activeModal === 'meeting' && selectedDeal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Book Meeting: {selectedDeal.company}</h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={triggerMeetingBook}>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Date</label>
                  <input
                    type="date"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Time</label>
                  <input
                    type="time"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location / Platform</label>
                <select
                  value={meetingForm.location}
                  onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                >
                  <option value="Zoom">Zoom Video</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="In Person">In Person (Client HQ)</option>
                  <option value="Phone Call">Phone Conference</option>
                </select>
              </div>
              <div className="form-group">
                <label>Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Scope review & demo"
                  value={meetingForm.purpose}
                  onChange={(e) => setMeetingForm({ ...meetingForm, purpose: e.target.value })}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-save btn-meeting">
                  <Calendar size={14} style={{ marginRight: '6px' }} />
                  <span>Book Meeting</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Proposal Modal */}
      {activeModal === 'proposal' && selectedDeal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Send Proposal: {selectedDeal.company}</h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="form-group">
              <label>Proposal Cover Message</label>
              <textarea
                rows="8"
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="button" className="btn-save btn-proposal" onClick={triggerSendProposal}>
                <Mail size={14} style={{ marginRight: '6px' }} />
                <span>Send Proposal Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {(activeModal === 'quote' || activeModal === 'invoice') && selectedDeal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Generate {activeModal === 'quote' ? 'Quotation' : 'Invoice'}</h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="preview-doc-box">
              <h4>Preview for {selectedDeal.company}</h4>
              <div className="preview-body">
                <div className="preview-row">
                  <span>Document Type:</span>
                  <strong>{activeModal.toUpperCase()}</strong>
                </div>
                <div className="preview-row">
                  <span>Deal Reference:</span>
                  <strong>{selectedDeal.title}</strong>
                </div>
                <div className="preview-row">
                  <span>Subtotal Amount:</span>
                  <strong>₹{selectedDeal.value.toLocaleString()}.00</strong>
                </div>
                <div className="preview-row">
                  <span>Sales Tax (18%):</span>
                  <strong>₹{(selectedDeal.value * 0.18).toLocaleString()}.00</strong>
                </div>
                <hr />
                <div className="preview-row total-row">
                  <span>Total Amount:</span>
                  <strong>₹{(selectedDeal.value * 1.18).toLocaleString()}.00</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="button" className="btn-save btn-generate" onClick={() => handleDownloadDoc(activeModal)}>
                <FileDown size={14} style={{ marginRight: '6px' }} />
                <span>Download Doc</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Deal Details Modal */}
      {activeModal === 'view' && selectedDeal && (
        <div className="modal-overlay">
          <div className="modal-content deal-details-modal">
            <div className="modal-header">
              <div className="details-header-title">
                <span className="details-company-tag">{selectedDeal.company}</span>
                <h3>{selectedDeal.title}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="details-grid">
              <div className="details-section">
                <h4>Deal Information</h4>
                <div className="details-info-row">
                  <span>Value:</span>
                  <strong>₹{selectedDeal.value.toLocaleString()}</strong>
                </div>
                <div className="details-info-row">
                  <span>Stage:</span>
                  <span className="stage-badge" style={{ background: `${STAGE_COLORS[selectedDeal.stage]}15`, color: STAGE_COLORS[selectedDeal.stage] }}>
                    {selectedDeal.stage}
                  </span>
                </div>
                <div className="details-info-row">
                  <span>Probability:</span>
                  <strong>{selectedDeal.probability}%</strong>
                </div>
                <div className="details-info-row">
                  <span>Contact Person:</span>
                  <strong>{selectedDeal.contact}</strong>
                </div>
                <div className="details-info-row">
                  <span>Phone Number:</span>
                  <strong>{selectedDeal.phone || "N/A"}</strong>
                </div>
                <div className="details-info-row">
                  <span>Email Address:</span>
                  <strong>{selectedDeal.email || "N/A"}</strong>
                </div>
                <div className="details-info-row">
                  <span>Created Date:</span>
                  <strong>{selectedDeal.date}</strong>
                </div>
              </div>

              <div className="details-section">
                <h4>Activity Timeline</h4>
                <div className="timeline-container">
                  <div className="timeline-item">
                    <span className="timeline-dot active"></span>
                    <div className="timeline-content">
                      <strong>Current Stage: {selectedDeal.stage}</strong>
                      <p>Deal probability is forecasted at {selectedDeal.probability}%.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-dot"></span>
                    <div className="timeline-content">
                      <strong>Deal Created</strong>
                      <p>Added to the pipeline on {selectedDeal.date}.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setActiveModal(null)}>Close</button>
              <button className="btn-save" onClick={() => { setActiveModal(null); openEditModal(selectedDeal); }}>
                <Edit3 size={14} style={{ marginRight: '6px' }} />
                <span>Edit Deal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;