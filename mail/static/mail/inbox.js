document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  load_mailbox('inbox');
  document.querySelector("form").onsubmit = function(){

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.getElementById('compose-recipients').value,
          subject: document.getElementById('compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
      })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);

        
        return load_mailbox('sent');})
        
        return false};

  // By default, load the inbox
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  
  document.querySelector('#emails-view').style.display = '';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(email => {
    // Print emails
    console.log(email);

    // ... do something else with emails ...
    email.forEach(element => {
      const div = document.createElement('div');
      div.id = "emails";
      document.querySelector("#emails-view").append(div)

      const div1 = document.createElement('div');
      if(element.read === true){
        div1.style.backgroundColor = ' rgb(218, 227, 230)';
        div1.style.color = 'black';
      }
      div1.id = "qwer"
      if(mailbox === 'inbox'){
        document.querySelector("#emails").append(div1)
      div1.innerHTML = `From : ${element.sender}<br>Subject : ${element.subject}<hr>Date : ${element.timestamp}`;
      }
      else{
        document.querySelector("#emails").append(div1)
        div1.innerHTML = `To : ${element.recipients}<br>Subject : ${element.subject}<hr>Date : ${element.timestamp}`;
      }
        div1.addEventListener('click', function() {

          div1.style.backgroundColor = ' rgb(218, 227, 230)';
          div1.style.color = 'black';

          fetch(`/emails/${element.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
          })

          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#email-view').style.display = '';
          document.querySelector('#email-view').innerHTML = '';

          fetch(`/emails/${element.id}`)
          .then(response => response.json())
          .then(email => {
              // Print email
              console.log(email);

              // ... do something else with email ...
              if(email.recipients.includes(document.getElementById('user').innerHTML)){

                const div2 = document.createElement('button');
                div2.style.cssText = "color:white;background-color:blue;border:none;width:100px;outline:none;margin:10px;margin-left:0px";
                div2.id = "qwert";
                div2.innerHTML = 'Reply';
                document.querySelector("#email-view").append(div2);
                div2.addEventListener('click',function(){
                  document.querySelector('#emails-view').style.display = 'none';
                  document.querySelector('#compose-view').style.display = '';
                  document.querySelector('#email-view').style.display = 'none';
                  
                  
                  document.querySelector("#compose-recipients").value = email.sender;
                  document.querySelector("#compose-body").value = `On ${email.timestamp}, ${email.sender} wrote:
                  
                  ${email.body}`;
                  
                  var n = email.subject.includes("RE:")
                  if (n == true){
                    document.querySelector("#compose-subject").value = email.subject
                  }
                  else{
                    document.querySelector("#compose-subject").value = `RE: ${email.subject}`
                  }
    
                })
                
              }
              
            if(email.recipients.includes(document.getElementById('user').innerHTML)){
              const but = document.createElement('button');
              
              if (email.archived == true){

                but.innerHTML = `UnArchive`;
              }
              else{

                but.innerHTML = `Archive`;

              }
              but.style.cssText = "color:white;background-color:blue;border:none;width:100px;outline:none;margin:10px;margin-left:0px";
              document.querySelector("#email-view").append(but)
              but.addEventListener('click', function(){

                if(email.archived == true){

                  fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: false
                    })
                  })
                }
                else{

                  fetch(`/emails/${email.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: true
                    })
                  })
                }
                location.reload();
              })
            }


            const div = document.createElement('div');
            div.id = "email1";
            document.querySelector("#email-view").append(div);
            const div1 = document.createElement('div');
            div1.id = "qwer"
            document.querySelector("#email1").append(div1)
            div1.innerHTML = `To : ${email.recipients}<br>From: ${email.sender}<br>Subject : ${email.subject}<br>Date : ${email.timestamp}<br><hr><br> ${email.body}`;
            div1.style.cssText = "word-break: break-word;font-family:'Times New Roman', Times, serif;font-size:1.1rem";
            
            

        });
        })

    });


});
}