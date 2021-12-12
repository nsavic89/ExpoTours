import { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import AppContextProvider from "./AppContext";
import Booking from "./views/Booking";
import ClientHome from './views/ClientHome';
import Services from "./views/Services";
import Rent from './views/Rent';
import About from "./views/About";
import Contact from "./views/Contact";
import Success from "./views/Success";
import Warning from "./views/Warning";
import Login from "./admin/Login";
import Admin from "./admin/Admin";
import NewEventForm from "./admin/NewEventForm";
import EventImages from "./admin/EventImages";
import Payment from "./views/Payment";
import GeneralConditions from "./views/GeneralConditions";
import Invoice from "./admin/Invoice";
import Payment2 from "./views/Payment2";



function Router() {
  return (
    <Suspense fallback='loading'>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<ClientHome/>} />
            <Route path='/booking/:id' element={<Booking/>} />
            <Route path='/services' element={<Services />} />
            <Route path='/location' element={<Rent />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/general-conditions' element={<GeneralConditions />} />
            <Route path='/success' element={<Success />} />
            <Route path='/warning' element={<Warning />} />
            <Route path='/payment/:id' element={<Payment />} />
            <Route path='/payment2/:id' element={<Payment2 />} />
            <Route path='/admin-login' element={<Login />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/admin-new-event' element={<NewEventForm />} />
            <Route path='/admin-images/:id' element={<EventImages />} />
            <Route path='/admin/facture/:id' element={<Invoice />} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </Suspense>
  );
}

export default Router;
