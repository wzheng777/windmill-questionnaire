window.WINDMILL_SETS = window.WINDMILL_SETS || {};
window.WINDMILL_SETS.millwork = {
  id: "millwork",
  name: "Millwork / woodwork factory",
  intro: "Tell us which jobs you'd like help with. There are no wrong answers.",
  groups: [
    { id: "drawings", title: "Drawings & estimating", items: [
      { id: "shop_drawings", label: "AutoCAD shop drawings from sketches or photos" },
      { id: "custom_drawings", label: "Custom drawings to client specs" },
      { id: "cnc_files", label: "CNC-ready cut files and nesting" },
      { id: "takeoffs", label: "Material takeoffs and quote calculation" },
      { id: "pdf_to_cad", label: "Converting PDF drawings to CAD" },
      { id: "renderings", label: "3D renderings for client approval" } ] },
    { id: "phones", title: "Phones & front desk", items: [
      { id: "ai_receptionist", label: "AI receptionist answering calls 24/7" },
      { id: "outbound_calls", label: "Outbound calls on your behalf (supplier follow-ups, delivery confirmations)" },
      { id: "call_summaries", label: "Call summaries texted to the owner" },
      { id: "lead_reply", label: "Replying to leads within an hour" } ] },
    { id: "sales", title: "Sales & quoting", items: [
      { id: "quote_intake", label: "Quote request intake form with drawing upload" },
      { id: "quote_followup", label: "Auto-follow-up on sent quotes" },
      { id: "bid_tracking", label: "Bid tracking for mall and GC tenders" },
      { id: "lead_finding", label: "Finding new mall and retail fit-out leads" } ] },
    { id: "production", title: "Production & operations", items: [
      { id: "job_scheduling", label: "Job scheduling for CNC and shop" },
      { id: "inventory", label: "Material inventory and reorder alerts" },
      { id: "progress_updates", label: "Job progress updates to clients" },
      { id: "install_scheduling", label: "Install-crew scheduling" } ] },
    { id: "admin", title: "Admin & money", items: [
      { id: "invoices", label: "Invoices" },
      { id: "payment_reminders", label: "Deposit (50%) and payment reminders" },
      { id: "receipts", label: "Receipt and expense capture" },
      { id: "documents", label: "Document and contract collection" } ] },
    { id: "marketing", title: "Marketing", items: [
      { id: "gallery", label: "Project photo gallery updates" },
      { id: "reviews", label: "Google review requests" },
      { id: "social", label: "Social posts" } ] }
  ]
};
