import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  Stethoscope,
  PieChart,
  Bell,
  CreditCard,
} from "lucide-react"

export const menuItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/",
    icon: <LayoutDashboard className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    id: "appointments",
    name: "Agendamentos",
    path: "/appointments",
    icon: <Calendar className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    id: "patients",
    name: "Pacientes",
    path: "/patients",
    icon: <Users className="w-5 h-5" strokeWidth={2.5} />,
    children: [
      {
        id: "patients-list",
        name: "Lista de Pacientes",
        path: "/patients/list",
      },
      {
        id: "patients-new",
        name: "Novo Paciente",
        path: "/patients/new",
      },
      {
        id: "patients-history",
        name: "Histórico Médico",
        path: "/patients/history",
      },
    ],
  },
  {
    id: "consultations",
    name: "Consultas",
    path: "/consultations",
    icon: <Stethoscope className="w-5 h-5" strokeWidth={2.5} />,
    children: [
      {
        id: "consultations-today",
        name: "Consultas de Hoje",
        path: "/consultations/today",
      },
      {
        id: "consultations-history",
        name: "Histórico",
        path: "/consultations/history",
      },
      {
        id: "consultations-prescriptions",
        name: "Receitas",
        path: "/consultations/prescriptions",
      },
    ],
  },
  {
    id: "reports",
    name: "Relatórios",
    path: "/reports",
    icon: <PieChart className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    id: "documents",
    name: "Documentos",
    path: "/documents",
    icon: <FileText className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    id: "billing",
    name: "Financeiro",
    path: "/billing",
    icon: <CreditCard className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    id: "notifications",
    name: "Notificações",
    path: "/notifications",
    icon: <Bell className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    id: "settings",
    name: "Configurações",
    path: "/settings",
    icon: <Settings className="w-5 h-5" strokeWidth={2.5} />,
    children: [
      {
        id: "settings-profile",
        name: "Perfil",
        path: "/settings/profile",
      },
      {
        id: "settings-clinic",
        name: "Dados da Clínica",
        path: "/settings/clinic",
      },
      {
        id: "settings-security",
        name: "Segurança",
        path: "/settings/security",
      },
    ],
  },
]
