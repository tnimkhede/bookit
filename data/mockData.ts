export interface Professional {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  nextAvailable: string;
  about: string;
  workingHours: {
    day: string;
    start: string;
    end: string;
    isWorking: boolean;
  }[];
  appointmentDuration: number;
  blockedDates: string[];
}

export interface Appointment {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalCategory: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  purpose: string;
  status: "booked" | "completed" | "cancelled" | "pending";
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "reminder" | "confirmation" | "cancellation" | "update";
}

export const CATEGORIES = [
  { id: "all", name: "All", icon: "grid" },
  { id: "doctor", name: "Doctors", icon: "activity" },
  { id: "salon", name: "Salons", icon: "scissors" },
  { id: "lawyer", name: "Lawyers", icon: "briefcase" },
  { id: "consultant", name: "Consultants", icon: "users" },
  { id: "tutor", name: "Tutors", icon: "book-open" },
] as const;

export const PROFESSIONALS: Professional[] = [
  {
    id: "prof-1",
    name: "Dr. Sarah Johnson",
    category: "Doctor",
    location: "New York, NY",
    rating: 4.9,
    nextAvailable: "Today 2:00 PM",
    about: "Board-certified physician with 15 years of experience in general medicine and preventive care.",
    workingHours: [
      { day: "Monday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Tuesday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Wednesday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Thursday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Friday", start: "09:00", end: "15:00", isWorking: true },
      { day: "Saturday", start: "10:00", end: "14:00", isWorking: true },
      { day: "Sunday", start: "", end: "", isWorking: false },
    ],
    appointmentDuration: 30,
    blockedDates: ["2025-12-25", "2025-12-31"],
  },
  {
    id: "prof-2",
    name: "Michael Chen",
    category: "Salon",
    location: "Los Angeles, CA",
    rating: 4.8,
    nextAvailable: "Tomorrow 10:00 AM",
    about: "Celebrity hairstylist specializing in modern cuts and color treatments.",
    workingHours: [
      { day: "Monday", start: "", end: "", isWorking: false },
      { day: "Tuesday", start: "10:00", end: "19:00", isWorking: true },
      { day: "Wednesday", start: "10:00", end: "19:00", isWorking: true },
      { day: "Thursday", start: "10:00", end: "19:00", isWorking: true },
      { day: "Friday", start: "10:00", end: "20:00", isWorking: true },
      { day: "Saturday", start: "09:00", end: "18:00", isWorking: true },
      { day: "Sunday", start: "11:00", end: "16:00", isWorking: true },
    ],
    appointmentDuration: 45,
    blockedDates: [],
  },
  {
    id: "prof-3",
    name: "Jennifer Williams",
    category: "Lawyer",
    location: "Chicago, IL",
    rating: 4.7,
    nextAvailable: "Dec 6 9:00 AM",
    about: "Corporate attorney with expertise in business law, contracts, and intellectual property.",
    workingHours: [
      { day: "Monday", start: "08:00", end: "18:00", isWorking: true },
      { day: "Tuesday", start: "08:00", end: "18:00", isWorking: true },
      { day: "Wednesday", start: "08:00", end: "18:00", isWorking: true },
      { day: "Thursday", start: "08:00", end: "18:00", isWorking: true },
      { day: "Friday", start: "08:00", end: "16:00", isWorking: true },
      { day: "Saturday", start: "", end: "", isWorking: false },
      { day: "Sunday", start: "", end: "", isWorking: false },
    ],
    appointmentDuration: 60,
    blockedDates: ["2025-12-24", "2025-12-25"],
  },
  {
    id: "prof-4",
    name: "David Park",
    category: "Consultant",
    location: "San Francisco, CA",
    rating: 4.9,
    nextAvailable: "Today 4:00 PM",
    about: "Business strategy consultant helping startups scale and enterprise companies innovate.",
    workingHours: [
      { day: "Monday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Tuesday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Wednesday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Thursday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Friday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Saturday", start: "", end: "", isWorking: false },
      { day: "Sunday", start: "", end: "", isWorking: false },
    ],
    appointmentDuration: 60,
    blockedDates: [],
  },
  {
    id: "prof-5",
    name: "Emily Rodriguez",
    category: "Tutor",
    location: "Boston, MA",
    rating: 4.8,
    nextAvailable: "Tomorrow 3:00 PM",
    about: "Mathematics and science tutor with PhD in Physics. Specializing in SAT/ACT prep.",
    workingHours: [
      { day: "Monday", start: "14:00", end: "20:00", isWorking: true },
      { day: "Tuesday", start: "14:00", end: "20:00", isWorking: true },
      { day: "Wednesday", start: "14:00", end: "20:00", isWorking: true },
      { day: "Thursday", start: "14:00", end: "20:00", isWorking: true },
      { day: "Friday", start: "14:00", end: "18:00", isWorking: true },
      { day: "Saturday", start: "10:00", end: "16:00", isWorking: true },
      { day: "Sunday", start: "", end: "", isWorking: false },
    ],
    appointmentDuration: 60,
    blockedDates: [],
  },
  {
    id: "prof-6",
    name: "Dr. Robert Martinez",
    category: "Doctor",
    location: "Miami, FL",
    rating: 4.6,
    nextAvailable: "Dec 5 11:00 AM",
    about: "Specialist in dermatology and cosmetic procedures with 20 years of experience.",
    workingHours: [
      { day: "Monday", start: "08:00", end: "16:00", isWorking: true },
      { day: "Tuesday", start: "08:00", end: "16:00", isWorking: true },
      { day: "Wednesday", start: "08:00", end: "16:00", isWorking: true },
      { day: "Thursday", start: "08:00", end: "16:00", isWorking: true },
      { day: "Friday", start: "08:00", end: "14:00", isWorking: true },
      { day: "Saturday", start: "", end: "", isWorking: false },
      { day: "Sunday", start: "", end: "", isWorking: false },
    ],
    appointmentDuration: 30,
    blockedDates: [],
  },
  {
    id: "prof-7",
    name: "Lisa Thompson",
    category: "Salon",
    location: "Seattle, WA",
    rating: 4.9,
    nextAvailable: "Today 5:00 PM",
    about: "Award-winning makeup artist and beauty consultant for weddings and special events.",
    workingHours: [
      { day: "Monday", start: "10:00", end: "18:00", isWorking: true },
      { day: "Tuesday", start: "10:00", end: "18:00", isWorking: true },
      { day: "Wednesday", start: "10:00", end: "18:00", isWorking: true },
      { day: "Thursday", start: "10:00", end: "18:00", isWorking: true },
      { day: "Friday", start: "10:00", end: "20:00", isWorking: true },
      { day: "Saturday", start: "09:00", end: "19:00", isWorking: true },
      { day: "Sunday", start: "", end: "", isWorking: false },
    ],
    appointmentDuration: 90,
    blockedDates: [],
  },
  {
    id: "prof-8",
    name: "James Wilson",
    category: "Lawyer",
    location: "Houston, TX",
    rating: 4.5,
    nextAvailable: "Dec 7 2:00 PM",
    about: "Family law attorney specializing in divorce, custody, and estate planning.",
    workingHours: [
      { day: "Monday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Tuesday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Wednesday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Thursday", start: "09:00", end: "17:00", isWorking: true },
      { day: "Friday", start: "09:00", end: "15:00", isWorking: true },
      { day: "Saturday", start: "", end: "", isWorking: false },
      { day: "Sunday", start: "", end: "", isWorking: false },
    ],
    appointmentDuration: 60,
    blockedDates: [],
  },
];

export const CLIENT_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    professionalId: "prof-1",
    professionalName: "Dr. Sarah Johnson",
    professionalCategory: "Doctor",
    clientId: "client-1",
    clientName: "John Smith",
    date: "2025-12-05",
    time: "10:00 AM",
    duration: 30,
    purpose: "Annual health checkup",
    status: "booked",
  },
  {
    id: "apt-2",
    professionalId: "prof-2",
    professionalName: "Michael Chen",
    professionalCategory: "Salon",
    clientId: "client-1",
    clientName: "John Smith",
    date: "2025-12-08",
    time: "2:00 PM",
    duration: 45,
    purpose: "Haircut and styling",
    status: "booked",
  },
  {
    id: "apt-3",
    professionalId: "prof-4",
    professionalName: "David Park",
    professionalCategory: "Consultant",
    clientId: "client-1",
    clientName: "John Smith",
    date: "2025-11-28",
    time: "3:00 PM",
    duration: 60,
    purpose: "Business strategy consultation",
    status: "completed",
  },
  {
    id: "apt-4",
    professionalId: "prof-3",
    professionalName: "Jennifer Williams",
    professionalCategory: "Lawyer",
    clientId: "client-1",
    clientName: "John Smith",
    date: "2025-11-20",
    time: "11:00 AM",
    duration: 60,
    purpose: "Contract review",
    status: "completed",
  },
  {
    id: "apt-5",
    professionalId: "prof-6",
    professionalName: "Dr. Robert Martinez",
    professionalCategory: "Doctor",
    clientId: "client-1",
    clientName: "John Smith",
    date: "2025-11-15",
    time: "9:00 AM",
    duration: 30,
    purpose: "Skin consultation",
    status: "cancelled",
  },
];

export const PROFESSIONAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-10",
    professionalId: "prof-1",
    professionalName: "Dr. Sarah Johnson",
    professionalCategory: "Doctor",
    clientId: "client-1",
    clientName: "John Smith",
    date: "2025-12-04",
    time: "9:00 AM",
    duration: 30,
    purpose: "Follow-up consultation",
    status: "booked",
  },
  {
    id: "apt-11",
    professionalId: "prof-1",
    professionalName: "Dr. Sarah Johnson",
    professionalCategory: "Doctor",
    clientId: "client-2",
    clientName: "Emily Davis",
    date: "2025-12-04",
    time: "10:00 AM",
    duration: 30,
    purpose: "Annual checkup",
    status: "booked",
  },
  {
    id: "apt-12",
    professionalId: "prof-1",
    professionalName: "Dr. Sarah Johnson",
    professionalCategory: "Doctor",
    clientId: "client-3",
    clientName: "Michael Brown",
    date: "2025-12-04",
    time: "11:30 AM",
    duration: 30,
    purpose: "Blood pressure review",
    status: "booked",
  },
  {
    id: "apt-13",
    professionalId: "prof-1",
    professionalName: "Dr. Sarah Johnson",
    professionalCategory: "Doctor",
    clientId: "client-4",
    clientName: "Sarah Wilson",
    date: "2025-12-04",
    time: "2:00 PM",
    duration: 30,
    purpose: "Vaccination",
    status: "pending",
  },
  {
    id: "apt-14",
    professionalId: "prof-1",
    professionalName: "Dr. Sarah Johnson",
    professionalCategory: "Doctor",
    clientId: "client-5",
    clientName: "James Lee",
    date: "2025-12-04",
    time: "3:30 PM",
    duration: 30,
    purpose: "General consultation",
    status: "booked",
  },
  {
    id: "apt-15",
    professionalId: "prof-1",
    professionalName: "Dr. Sarah Johnson",
    professionalCategory: "Doctor",
    clientId: "client-6",
    clientName: "Lisa Anderson",
    date: "2025-12-03",
    time: "10:00 AM",
    duration: 30,
    purpose: "Medical certificate",
    status: "completed",
  },
  {
    id: "apt-16",
    professionalId: "prof-1",
    professionalName: "Dr. Sarah Johnson",
    professionalCategory: "Doctor",
    clientId: "client-7",
    clientName: "Robert Taylor",
    date: "2025-12-03",
    time: "2:30 PM",
    duration: 30,
    purpose: "Prescription renewal",
    status: "completed",
  },
  {
    id: "apt-17",
    professionalId: "prof-1",
    professionalName: "Dr. Sarah Johnson",
    professionalCategory: "Doctor",
    clientId: "client-8",
    clientName: "Jennifer White",
    date: "2025-12-02",
    time: "11:00 AM",
    duration: 30,
    purpose: "Skin allergy consultation",
    status: "cancelled",
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    title: "Appointment Reminder",
    message: "Your appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM",
    timestamp: "2 hours ago",
    read: false,
    type: "reminder",
  },
  {
    id: "notif-2",
    title: "Booking Confirmed",
    message: "Your appointment with Michael Chen on Dec 8 at 2:00 PM has been confirmed",
    timestamp: "1 day ago",
    read: false,
    type: "confirmation",
  },
  {
    id: "notif-3",
    title: "Schedule Update",
    message: "Dr. Robert Martinez has updated their availability for next week",
    timestamp: "2 days ago",
    read: true,
    type: "update",
  },
  {
    id: "notif-4",
    title: "Appointment Completed",
    message: "Your consultation with David Park has been marked as completed",
    timestamp: "1 week ago",
    read: true,
    type: "confirmation",
  },
  {
    id: "notif-5",
    title: "Cancellation Notice",
    message: "Your appointment with Dr. Robert Martinez on Nov 15 was cancelled",
    timestamp: "3 weeks ago",
    read: true,
    type: "cancellation",
  },
];

export const AVAILABLE_TIME_SLOTS: TimeSlot[] = [
  { time: "09:00 AM", available: true },
  { time: "09:30 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: true },
  { time: "12:00 PM", available: false },
  { time: "12:30 PM", available: false },
  { time: "01:00 PM", available: false },
  { time: "01:30 PM", available: true },
  { time: "02:00 PM", available: true },
  { time: "02:30 PM", available: true },
  { time: "03:00 PM", available: false },
  { time: "03:30 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "04:30 PM", available: false },
];

export function getCategoryIcon(category: string): string {
  switch (category.toLowerCase()) {
    case "doctor":
      return "activity";
    case "salon":
      return "scissors";
    case "lawyer":
      return "briefcase";
    case "consultant":
      return "users";
    case "tutor":
      return "book-open";
    default:
      return "user";
  }
}

export function getStatusColor(status: Appointment["status"]): string {
  switch (status) {
    case "booked":
      return "#3B82F6";
    case "completed":
      return "#10B981";
    case "cancelled":
      return "#EF4444";
    case "pending":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
}
