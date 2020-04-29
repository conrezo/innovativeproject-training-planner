import React, { useEffect, useState } from "react";
import { renderEmail } from "react-html-email";
import ReactEmailHTML from "./reactEmailHtml.component";
import BetterChips from "../addons/betterChips.componenet.js";
import M from "materialize-css";
import axios from "axios";

const SendInvite = props => {
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("");

  useEffect(() => {
    let id = window.location.href;
    let i = id.lastIndexOf("/");
    id = id.slice(i + 1);
    console.log(id);
    console.log(`sendInvite/get/${id}`);
    axios.get(`/sendInvite/get/${id}`).then(res => {
      setTemplate(res.data[0]);
    });
  }, []);

  useEffect(() => {
    setMessage(renderEmail(ReactEmailHTML(template)));
  }, [template]);

  const onSend = event => {
    event.preventDefault();
    const mail = {
      recipients: recipients.join(","),
      subject,
      message,
      template
    };

    axios.post("/sendInvite/send", mail).then(res => {
      console.log(res.data);
    });

    // TODO make it dependand on post success
    M.toast({ html: "E-MAIL SENT!", classes: "rounded pink lighten-1" });
    props.history.push("/templateDashboard");
  };

  return (
    <div className="container">
      <form className="white col s12" onSubmit={onSend}>
        <div className="row center">
          <div className="col s6 offset-s3">
            <BetterChips
              label="Recipients"
              inputType="email"
              value={recipients}
              onEnter={setRecipients}
            />
          </div>
          <div className="input-field col s6 offset-s3">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>
          <div className="card-panel col s6 m8 offset-m2">
            {ReactEmailHTML(template)}
          </div>
        </div>
        <div className="input-field col s6 offset-s3">
          <div className="row center">
            <div className="col s2 offset-s4">
              <a className="btn pink lighten-1" href="/templateDashboard">
                <i className="material-icons left">cancel</i>CANCEL
              </a>
            </div>
            <div className="col s2">
              <button className="btn pink lighten-1">
                <i className="material-icons left">mail</i>SEND
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SendInvite;
