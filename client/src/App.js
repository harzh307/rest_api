import logo from "./logo.svg";
import React, { useEffect, useState } from "react";

import "./App.css";
import instance from "./axios";

function App() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [inputSubmit, setInputSubmit] = useState(false);

  useEffect(() => {
    getData();
    return () => {};
  }, []);
  const getData = async () => {
    const response = await instance.get("/api/courses");
    setCourses(response.data.data);
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async () => {
    setInputSubmit(true);
    if (!name.trim()) {
      return;
    } else {
      const response = await instance.post("/api/courses", {
        name,
      });
      setName("");
      console.log({ fetched: response.data });
      setCourses([response.data.course, ...courses]);
      setInputSubmit(false);
    }
  };

  return (
    <div className="App">
      <input onChange={onChangeName} />
      <button onClick={handleSubmit}>submit</button>
      {courses?.map((x, i) => (
        <div key={`course_${x?.id}_${i}`}>
          <p>{x?.id + " - " + x?.name ?? "harsh"}</p>
          {/* <p>{}</p> */}
        </div>
      ))}
    </div>
  );
}

export default App;
