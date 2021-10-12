
document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', function(){
    reply = false;
    compose_email();
  });
  document.querySelector('form').onsubmit = send_mail;
  
  // By default, load the inbox
  load_mailbox('inbox');  
});

// To check when the reply button is clicked.
var reply = false;

function compose_email() {
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  

  // Clear out composition fields
  if (reply === false){
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = ''; 
    document.querySelector('#compose-body').value = ''; 
  }
  
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get the emails.
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);

    // Handle the mails.
    const tbl = document.createElement("table");
    tbl.className = "table table-hover";
    const tb = document.createElement("tbody");
    tbl.append(tb);
    

    // Iterate through the email array.
    for (let i = 0; i < emails.length; i++){
      const body = emails[i].body;
      const email = emails[i].sender;
      const recipient = emails[i].recipients;
      const time = emails[i].timestamp;
      const subj = emails[i].subject;
      const Id = emails[i].id;
      let read = emails[i].read;
      let archived = emails[i].archived;
     
      // Create table row and table data for display.  
      const  td = document.createElement("td");
      const tr = document.createElement("tr");
      
      // Make the read mails in the inbox to appear grey.
      if (read === true && mailbox === 'inbox'){
        td.style.backgroundColor = 'grey';
      }
      else{
        td.style.backgroundColor = 'white';
      }
      
      td.innerHTML = `<b>${email}</b>- ${subj} <span style="position:absolute; left:75%;">${time}</span>`;
      
      // Add an event listener to display the email when clicked.
      td.addEventListener('click', () => disp_on_click(email, time, body, subj, recipient, Id, archived));
      tr.append(td);
      tb.append(tr);      
    }
    // Append the table to emails-view.
    document.querySelector('#emails-view').append(tbl);
});
}


function send_mail() {
  
  const recipient= document.querySelector('#compose-recipients').value;
  const subj = document.querySelector('#compose-subject').value;
  const msg_body = document.querySelector('#compose-body').value;
  
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipient,
      subject: subj,
      body: msg_body
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
});
localStorage.clear();
load_mailbox('sent');
return false;
}

// Display email content. 
function disp_email(email, recipient, subj, time, body){

  document.querySelector('#emails-view').innerHTML = `<div><b>From: </b> ${email} <br>
        <b>To: </b> ${recipient} <br><b>Subject: </b> ${subj}<br> <b>Timestamp: </b> ${time} 
        <br> <button class='btn btn-sm btn-outline-primary' id='reply_btn' type=button value=reply>reply</button> 
        <br><hr> ${body} <br></div>`;

}

// Reply a mail.
function reply_email(email, subj, body, time){
  
  document.querySelector('#reply_btn').addEventListener('click', function (){
    document.querySelector('#compose-recipients').value = `${email}`;
    document.querySelector('#compose-subject').value = `Re: ${subj}`;  
    document.querySelector('#compose-body').value = `"On ${time}, ${email} wrote: ${body}"`;
    // Set reply to true.
    reply = true;

    compose_email();
  });
}

// Archive a mail.
function archive(btn_value, Id){

  if(btn_value === 'archive'){
            
    fetch(`/emails/${Id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
      
    });
    localStorage.clear();
    load_mailbox('archive');
  } 
  else{
    fetch(`/emails/${Id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
      
    });
    localStorage.clear();
    load_mailbox('inbox');
  }
  
}

function disp_on_click(email, time, body, subj, recipient, Id, archived){
  
        // Display email content. 
        disp_email(email, recipient, subj, time, body);

        //Reply to an email.
        reply_email(email, subj, body, time);

        // Create a button to archive and unarchive an email.
        var btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-outline-primary';
        var btn_value;
        
        // Change button value accordingly.
        if (archived === true){
          btn.innerHTML = 'Unarchive';
          btn_value = btn.innerHTML;
        }
        else{
          btn.innerHTML = 'archive';
          btn_value = btn.innerHTML;
        }
        
        // Add an event listener to the archive button.
        btn.addEventListener('click', () => archive(btn_value, Id));

        document.querySelector('#emails-view').append(btn);
        
        // Mark the email as read.
        fetch(`/emails/${Id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
          
        });
}


