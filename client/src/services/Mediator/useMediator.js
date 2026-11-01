import { MEDIATOR, EMESSAGES } from "../../config";
import Mediator from "./Mediator";

const useMediator = () => {
    const ALL_EVENTS = { ...MEDIATOR.EVENTS };
    Object.keys(EMESSAGES).forEach(key =>
        ALL_EVENTS[key] = EMESSAGES[key]
    );

    const mediator = new Mediator({ 
        EVENTS: ALL_EVENTS, 
        TRIGGERS: MEDIATOR.TRIGGERS 
    });

    return mediator;
}

export default useMediator;