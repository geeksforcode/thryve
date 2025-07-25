import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const sections = [
  { key: "post-job", label: "Post Job" },
  { key: "my-jobs", label: "My Jobs" },
  { key: "notifications", label: "Notifications" },
  { key: "logout", label: "Logout" },
];

const EmployerDashboard = () => {
  const [selected, setSelected] = useState("post-job");
  const [success, setSuccess] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  // Simulate application notification for demo
  window.addEventListener("applicationSubmitted", (e: any) => {
    setNotifications((prev: any[]) => [
      {
        id: Date.now(),
        message: `New application submitted for job: ${e.detail?.jobTitle || "Unknown"}`,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  });

  // Edit job handlers (local state for title editing only)
  const startEditJob = (job: any) => {
    setEditJobId(job.id);
    setEditTitle(job.title);
  };
  const saveEditJob = (jobId: number) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, title: editTitle } : job,
      ),
    );
    setEditJobId(null);
    setEditTitle("");
  };
  const deleteJob = (jobId: number) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
    if (expandedJobId === jobId) setExpandedJobId(null);
  };

  // Applicant status handler (not implemented for local demo)
  const updateApplicantStatus = (
    jobId: number,
    applicantId: number,
    status: string,
  ) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              applicants: job.applicants.map((applicant) =>
                applicant.id === applicantId
                  ? { ...applicant, status }
                  : applicant,
              ),
            }
          : job,
      ),
    );
  };

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      location: "",
      salary: "",
      deadline: "",
      company: "",
      status: "open",
    },
  });

  const onSubmit = (data: any) => {
    const newJob = {
      ...data,
      id: Date.now(),
      applicants: [],
    };
    setJobs([newJob, ...jobs]);
    setSuccess("Job posted successfully!");
    form.reset();
    setTimeout(() => setSuccess(""), 3000);
    setNotifications([
      {
        id: Date.now(),
        message: `New job posted: ${data.title}`,
        timestamp: Date.now(),
      },
      ...notifications,
    ]);
  };

  const clearNotifications = () => setNotifications([]);

  // Handle logout
  const handleLogout = () => {
    // Optionally clear any auth state here
    navigate("/login");
  };

  // you will finish, whoever did this part, Congratulations you had me thinking, goooosh that was sum
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Navigation />
      <div className="flex max-w-7xl mx-auto w-full">
        <SidebarProvider className="h-full flex-1">
          <Sidebar className="bg-white border-r min-h-full py-10 px-2 mt-[35px]">
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
          <main className=" w-full p-8 md:p-10 flex flex-col">
            {selected === "post-job" && (
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Post a New Job
                </h2>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Senior React Developer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the job role and responsibilities..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requirements"
                      rules={{ required: "Requirements are required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List the requirements..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      rules={{ required: "Location is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Remote, New York, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salary"
                      rules={{ required: "Salary is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. $120k - $160k"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deadline"
                      rules={{ required: "Deadline is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deadline</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      rules={{ required: "Company name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. TechCorp Inc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Select
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : "open"
                              }
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Post Job
                    </Button>
                    {success && (
                      <div className="text-green-600 font-semibold text-center">
                        {success}
                      </div>
                    )}
                  </form>
                </Form>
              </div>
            )}
            {selected === "my-jobs" && (
              <div className="w-full overflow-x-auto">
                <h2 className="text-2xl font-bold mb-4">My Jobs</h2>
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="py-2 px-4">Title</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Location</th>
                      <th className="py-2 px-4">Deadline</th>
                      <th className="py-2 px-4">Applicants</th>
                      <th className="py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <React.Fragment key={job.id}>
                        <tr className="border-b">
                          <td className="py-2 px-4 font-medium">
                            {editJobId === job.id ? (
                              <input
                                className="border rounded px-2 py-1 text-sm"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                              />
                            ) : (
                              job.title
                            )}
                          </td>
                          <td className="py-2 px-4 capitalize">{job.status}</td>
                          <td className="py-2 px-4">{job.location}</td>
                          <td className="py-2 px-4">{job.deadline}</td>
                          <td className="py-2 px-4">{job.applicants.length}</td>
                          <td className="py-2 px-4 flex gap-2">
                            {editJobId === job.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveEditJob(job.id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditJobId(null)}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setExpandedJobId(
                                      expandedJobId === job.id ? null : job.id,
                                    )
                                  }
                                >
                                  {expandedJobId === job.id
                                    ? "Hide Applicants"
                                    : "View Applicants"}
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => startEditJob(job)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteJob(job.id)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                        {expandedJobId === job.id && (
                          <tr>
                            <td colSpan={6} className="bg-gray-50 px-4 py-4">
                              <div>
                                <h3 className="font-semibold mb-2">
                                  Applicants:
                                </h3>
                                {job.applicants.length === 0 ? (
                                  <div className="text-gray-500">
                                    No applicants yet.
                                  </div>
                                ) : (
                                  <ul className="space-y-2">
                                    {job.applicants.map((applicant) => (
                                      <li
                                        key={applicant.id}
                                        className="flex items-center gap-4"
                                      >
                                        <span className="font-medium">
                                          {applicant.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          {applicant.email}
                                        </span>
                                        <a
                                          href={`#`}
                                          className="text-blue-600 underline text-sm"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View CV
                                        </a>
                                        <span className="text-xs px-2 py-1 rounded bg-gray-200 ml-2 capitalize">
                                          {applicant.status}
                                        </span>
                                        <select
                                          className="border rounded px-1 py-0.5 text-xs"
                                          value={applicant.status}
                                          onChange={(e) =>
                                            updateApplicantStatus(
                                              job.id,
                                              applicant.id,
                                              e.target.value,
                                            )
                                          }
                                        >
                                          <option value="pending">
                                            Pending
                                          </option>
                                          <option value="shortlisted">
                                            Shortlisted
                                          </option>
                                          <option value="rejected">
                                            Rejected
                                          </option>
                                          <option value="hired">Hired</option>
                                        </select>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {selected === "notifications" && (
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Notifications</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearNotifications}
                  >
                    Clear All
                  </Button>
                </div>
                <ul className="space-y-3">
                  {notifications.length === 0 ? (
                    <li className="text-gray-500 text-center py-4">
                      No notifications yet.
                    </li>
                  ) : (
                    notifications.map((n) => (
                      <li
                        key={n.id}
                        className="bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-gray-800">{n.message}</p>
                          <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                            {new Date(n.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
            {selected === "logout" && (
              <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Are you sure you want to logout?
                </h2>

                <Button className="w-40" onClick={handleLogout}>
                  <p className="text-white">Logout</p>
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployerDashboard;
