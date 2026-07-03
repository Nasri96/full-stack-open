import { useContext } from "react";
import CounterContext from "./notificationContext";

const useNotify = () => useContext(CounterContext);

export default useNotify;