import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const sections = [
  { key: "browse-jobs", label: "Browse Jobs" },
  { key: "notifications", label: "Notifications" },
  { key: "logout", label: "Logout" },
];

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    salary: "100k - 120k",
    deadline: "2025-08-01",
    description: "Build and maintain web applications using React.",
    requirements: "2+ years experience with React, TypeScript."
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Designify",
    location: "Remote, Nairobi",
    salary: "80k - 100k",
    deadline: "2025-08-10",
    description: "Design user interfaces and experiences for mobile and web.",
    requirements: "Portfolio, Figma, Adobe XD."
  }
];

const EmployeeDashboard = () => {
  const [selected, setSelected] = useState("browse-jobs");
  const [applyJobId, setApplyJobId] = useState<number | null>(null);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cv: "",
    workTitle: "",
    workCompany: "",
    workDuration: "",
    workDuties: "",
    skills: "",
    qualification: "",
    portfolio: "",
  });
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New job posted: Frontend Developer", timestamp: Date.now() },
    { id: 2, message: "New job posted: UI/UX Designer", timestamp: Date.now() },
  ]);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "cv" && e.target instanceof HTMLInputElement && e.target.files) {
      setCvFile(e.target.files[0]);
      setForm({ ...form, cv: e.target.files[0]?.name || "" });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleApply = (jobId: number) => {
    setApplyJobId(jobId);
    setSuccess("");
    setForm({
      name: "",
      email: "",
      phone: "",
      cv: "",
      workTitle: "",
      workCompany: "",
      workDuration: "",
      workDuties: "",
      skills: "",
      qualification: "",
      portfolio: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("Application submitted!");
    setTimeout(() => setSuccess(""), 3000);
    setApplyJobId(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      cv: "",
      workTitle: "",
      workCompany: "",
      workDuration: "",
      workDuties: "",
      skills: "",
      qualification: "",
      portfolio: "",
    });
    setCvFile(null);
    // For demo: dispatch a custom event for employer notification
    const job = mockJobs.find(j => j.id === applyJobId);
    window.dispatchEvent(new CustomEvent('applicationSubmitted', { detail: { jobTitle: job?.title } }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <SidebarProvider className="h-full">
          <Sidebar className="bg-white border-r w-56 min-h-full py-8 px-2">
            <nav className="flex flex-col gap-2">
              {sections.map((section) => (
                <Button
                  key={section.key}
                  variant={selected === section.key ? "default" : "ghost"}
                  className="justify-start w-full"
                  onClick={() => setSelected(section.key)}
                >
                  {section.label}
                </Button>
              ))}
            </nav>
          </Sidebar>
        </SidebarProvider>
        <div className="container mx-auto px-4">
        <main className="flex-1 p-8">
          {selected === "browse-jobs" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
              {mockJobs.length === 0 && <div className="text-gray-500">No jobs available.</div>}
              <div className="space-y-6">
                {mockJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded shadow p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 capitalize">{job.location}</span>
                    </div>
                    <div className="text-gray-600 mb-2">{job.company}</div>
                    <div className="mb-2"><span className="font-semibold">Salary:</span> {job.salary}</div>
                    <div className="mb-2"><span className="font-semibold">Deadline:</span> {job.deadline}</div>
                    <div className="mb-2"><span className="font-semibold">Description:</span> {job.description}</div>
                    <div className="mb-2"><span className="font-semibold">Requirements:</span> {job.requirements}</div>
                    <Button className="mt-2" onClick={() => handleApply(job.id)} disabled={applyJobId !== null && applyJobId !== job.id}>Apply</Button>
                    {applyJobId === job.id && (
                      <div className="mt-6 border-t pt-4">
                        <h4 className="font-semibold mb-2">Application Form</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <Input name="name" placeholder="Name" value={form.name} onChange={handleInputChange} required />
                          <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleInputChange} required />
                          <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleInputChange} required />
                          <div>
                            <label className="block mb-1 font-medium">Upload CV (PDF only)</label>
                            <input
                              name="cv"
                              type="file"
                              accept="application/pdf"
                              onChange={handleInputChange}
                              required
                              className="block w-full border rounded px-2 py-1"
                            />
                            {cvFile && <span className="text-xs text-gray-600 mt-1 block">Selected: {cvFile.name}</span>}
                          </div>
                          <div className="border rounded p-4">
                            <div className="font-semibold mb-2">Work Experience</div>
                            <Input name="workTitle" placeholder="Job Title" value={form.workTitle} onChange={handleInputChange} required />
                            <Input name="workCompany" placeholder="Company Name" value={form.workCompany} onChange={handleInputChange} required />
                            <Input name="workDuration" placeholder="Duration (Start - End)" value={form.workDuration} onChange={handleInputChange} required />
                            <Textarea name="workDuties" placeholder="Duties/Responsibilities" value={form.workDuties} onChange={handleInputChange} required />
                          </div>
                          <Input name="skills" placeholder="Skills" value={form.skills} onChange={handleInputChange} required />
                          <Input name="qualification" placeholder="Qualification" value={form.qualification} onChange={handleInputChange} required />
                          <Input name="portfolio" placeholder="Portfolio Link or GitHub" value={form.portfolio} onChange={handleInputChange} />
                          <div className="flex gap-2">
                            <Button type="submit">Submit Application</Button>
                            <Button type="button" variant="outline" onClick={() => setApplyJobId(null)}>Cancel</Button>
                          </div>
                        </form>
                        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {selected === "notifications" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              <ul className="mt-4 space-y-2">
                {notifications.length === 0 && <li className="text-gray-500">No notifications.</li>}
                {notifications.map((n) => (
                  <li key={n.id} className="bg-gray-100 rounded px-4 py-2 text-sm">
                    {n.message} <span className="text-xs text-gray-400 ml-2">{new Date(n.timestamp).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selected === "logout" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Logout</h2>
              <Button className="mt-4">Logout</Button>
            </div>
          )}
        </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeDashboard;
