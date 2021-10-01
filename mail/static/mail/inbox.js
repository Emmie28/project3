document.addEventListener('DOMContentLoaded', function() {
  

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose_mail').addEventListener('click', send_mail);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
    // Print emails
    let email = emails[0];
    alert(`This is the  ${email.recipients}`);
    console.log(emails);

    // ... do something else with emails ...
});
}

function send_mail() {
  
  alert('This is the send mail function working.');
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
  }
  )
  .then(response => response.json())
  .then(result => {
    // Print result
    alert(`the recipient is ${subj}`);
    console.log(result);
});
}