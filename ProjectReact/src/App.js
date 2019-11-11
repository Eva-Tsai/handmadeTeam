import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  Handmade,
  Navgation,
  Course,
  Cart,
  Member,
  Store,
  Teacher,
  Ingredients
} from "./routes/index";
function App() {
  const [login, setLogin] = useState(false);

  const checkLogIn = () => {
    setLogin(!login);
  }

  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Navgation}></Route>
          <Route path="/handmade/" exact component={()=><Handmade login={{ login }} checkLogIn={checkLogIn} />} ></Route>
          <Route path="/handmade/store/course/" exact component={() => <Course login={{ login }} checkLogIn={checkLogIn} />}></Route>
          <Route path="/handmade/cart" component={() => <Cart login={{ login }} checkLogIn={checkLogIn} />}></Route>
          <Route path="/handmade/member/:id?" component={() => <Member login={{ login }} checkLogIn={checkLogIn} />}></Route>
          <Route path="/handmade/store/" exact component={() => <Store login={{ login }} checkLogIn={checkLogIn} />}></Route>
          <Route path="/handmade/teacher/:id?" component={() => <Teacher login={{ login }} checkLogIn={checkLogIn} />}></Route>
          <Route
            path="/handmade/ingredients/:id?"
            component={() => <Ingredients login={{ login }} checkLogIn={checkLogIn} />}
          ></Route>
        </Switch>
      </Router>
    </>
  );
}
export default App;
