# recipe-share-backend
This repository contains the back-end code for the recipe share website. 

See front end code (https://github.com/dacowan404/recipe-share-frontend)

This website allows user to create account, login/logout, and update passwords.
It also allows users to view, create, edit and delete recipes. The goal of this 
website is for recipes to be easily shared with other in a format that make viewing
the ingredients and step clear and not burying underneath paragraphs of text.

The website was created used a MERN stack. This repository contains the front-end code
and is created using React and Javascript. The front-end sends requests to the back-end.
The backend is a REST API which was created using Express.js and Node.js. The backend 
takes the request and if necessary verifies the identity of the user using a web token 
and then queries/updates MongoDB Atlas. The backend then send data back to the front-end
which is then rendered on the webpage.

Earlier versions of this website were stored in a single repository 
(https://github.com/dacowan404/recipe-share)