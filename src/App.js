import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/tables/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import BarChart from "./components/BarChart";
import CreateUser from "./scenes/form/CreateUser";
import CreateProject from "./scenes/form/CreateProject";
import EmployeeInfo from "./scenes/form/EmployeeInfo";
import SubmitTimeoff from "./scenes/form/submittimeoff";
import CreateInvoice from "./scenes/form/CreateInvoice";
import Feedback from "./scenes/form/AddFeedback";
import Doc from "./scenes/form/UploadDocument";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import PieChart from "./components/PieChart";
import FAQ from "./scenes/faq";
import Login from "./scenes/Login/login";
import Geography from "./scenes/geography";
import SubmitFeedbacks from "./scenes/tables/SubmitFeebacks";
import AllDoc from "./scenes/tables/AllDocuments";
import Salary from "./scenes/tables/EarningAndDeductions";
import ManageException from "./scenes/tables/ManageExceptions";
import MainComponent from "./scenes/tables/Main";
import Clock from "./scenes/tables/Clock";
import View from "./scenes/tables/ViewInvoice";
import ViewOne from "./scenes/tables/viewoneinvoice";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Account from "./scenes/contacts/account";
import AssignTasks from "./scenes/form/AssignTasks";
import ProjectTaskPage from "./scenes/form/ProjectTaskPage";
import TaskStatus from "./scenes/tables/TaskStatus";
import MyTasks from "./scenes/tables/MyTasks";
import TimeoffApp from "./scenes/tables/TimeOffApp";
import Test from "./components/Test";
import LineChartParent from "./components/LineChartParent";
import LineChart from "./components/LineChart";
import ClockGrid from "../src/scenes/tables/Clockgrid";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/ChatBot";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} />} />
              <Route path="/team" element={<ProtectedRoute Component={Team} />} />
              <Route path="/contacts" element={<ProtectedRoute Component={Contacts} />} />
              <Route path="/invoices" element={<ProtectedRoute Component={Invoices} />} />
              <Route path="/createuser" element={<ProtectedRoute Component={CreateUser} />} />
              <Route path="/createproject" element={<ProtectedRoute Component={CreateProject} />} />
              <Route path="/employeeinfo" element={<ProtectedRoute Component={EmployeeInfo} />} />
              <Route path="/createinvoice" element={<ProtectedRoute Component={CreateInvoice} />} />
              <Route path="/uploaddocument" element={<ProtectedRoute Component={Doc} />} />
              <Route path="/feedback" element={<ProtectedRoute Component={Feedback} />} />
              <Route path="/timeoffreq" element={<ProtectedRoute Component={SubmitTimeoff} />} />
              <Route path="/submitfeedbacks" element={<ProtectedRoute Component={SubmitFeedbacks} />} />
              <Route path="/alldocuments" element={<ProtectedRoute Component={AllDoc} />} />
              <Route path="/earninganddeductions" element={<ProtectedRoute Component={Salary} />} />
              <Route path="/holidays" element={<ProtectedRoute Component={ManageException} />} />
              <Route path="/clock" element={<ProtectedRoute Component={Clock} />} />
              <Route path="/view" element={<ProtectedRoute Component={View} />} />
              <Route path="/viewInvoice/:id" element={<ProtectedRoute Component={ViewOne} />} />
              <Route path="/assigntasks" element={<ProtectedRoute Component={AssignTasks} />} />
              <Route path="/taskstatus" element={<ProtectedRoute Component={TaskStatus} />} />
              <Route path="/mytasks" element={<ProtectedRoute Component={MyTasks} />} />
              <Route path="project/:projectName" element={<ProtectedRoute Component={ProjectTaskPage} />} />
              <Route path="/account" element={<ProtectedRoute Component={Account} />} />
              <Route path="/main" element={<ProtectedRoute Component={MainComponent} />} />
              <Route path="/timeoffapp" element={<ProtectedRoute Component={TimeoffApp} />} />
              <Route path="/barchart" element={<ProtectedRoute Component={BarChart} />} />
              <Route path="/pie" element={<ProtectedRoute Component={Pie} />} />
              <Route path="/piechart" element={<ProtectedRoute Component={PieChart} />} />
              <Route path="/line" element={<ProtectedRoute Component={Line} />} />
              <Route path="/faq" element={<ProtectedRoute Component={FAQ} />} />
              <Route path="/calendar" element={<ProtectedRoute Component={Calendar} />} />
              <Route path="/geography" element={<ProtectedRoute Component={Geography} />} />
              <Route path="/check" element={<ProtectedRoute Component={Test} />} />
              <Route path="/line" element={<ProtectedRoute Component={LineChart} />} />
              <Route path="/clockgrid" element={<ProtectedRoute Component={ClockGrid} />} />
              <Route path="/ChatBot" element={<ProtectedRoute Component={Chatbot} />} />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
