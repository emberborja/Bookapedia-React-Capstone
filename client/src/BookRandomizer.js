import React, { useState } from 'react';
import axios from 'axios';
import Nav from './Nav';
import Logo from './Logo';
import { useGlobalState } from "../src/context/GlobalState";
import request from './services/api.request';
// eslint-disable-next-line
import { NavLink, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const BookRandomizer = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  // eslint-disable-next-line
  const [state, dispatch] = useGlobalState();
  // let navigate = useNavigate();

  const handleClick = async () => {
    try {
      // going to edit - Josh
      // it is utilizing the AuthService and some other cool axios features to 
      // send your credentials of your logged in user to the backend.
      let options = {
        url: 'save-book/', // because you have API_URL defined in api.constants, this just attaches to the end of it
        method: 'POST', // This makes the request set up to be axios.post()
        data: { // this is everything that you want to send to the backend
          title: selectedBook.volumeInfo.title,
          author: selectedBook.volumeInfo.authors[0],
          description: selectedBook.volumeInfo.description,
          date_published: selectedBook.volumeInfo.publishedDate,
          marked_read: false,
          image_link: selectedBook.volumeInfo.imageLinks?.smallThumbnail,
          saved_by: state.currentUser.user_id,
          preview_link: selectedBook.volumeInfo.previewLink
        }
      }
      let response = await request(options)
      console.log(response.data)
      toast.success(`${selectedBook.volumeInfo.title} has been added to your Bookshelf!`)
    } catch (error) {
      console.log(error);
    }
    // console.log('clicked')
    // console.log(state.currentUser.user_id)
    // navigate('/my-bookshelf');
  }

  const getRandomBook = async () => {
    const response = await axios.get(
      'https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=40'
    );
    const books = response.data.items;
    const randomIndex = Math.floor(Math.random() * books.length);
    const selected = books[randomIndex];
    setSelectedBook(selected);
  };

  // const handleModal = () => {
  //   navigate('/my-bookshelf');
  // }

  return (
    <>
      <Nav />
      <div>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
            </div>
      <Logo />
      <div>
        <div className="text-center btnDiv">
          <button className="btn bookshelfButton" onClick={getRandomBook}>Get Random Book</button>
          {selectedBook && state.currentUser &&
            <button onClick={handleClick} className="btn bookshelfButton">Add to my bookshelf!</button>
            // <>
            //   <button type="button" onClick={handleClick} className="btn bookshelfButton" data-bs-toggle="modal" data-bs-target="#exampleModal">
            //     Add to my Bookshelf!
            //   </button>
            //   <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            //     <div className="modal-dialog">
            //       <div className="modal-content">
            //         <div className="modal-header">
            //           <h5 className="modal-title" id="exampleModalLabel">Success!</h5>
            //           <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            //         </div>
            //         <div className="modal-body">
            //           {selectedBook.volumeInfo.title} has been added to your Bookshelf!
            //         </div>
            //         <div className="modal-footer">
            //           <button onClick={handleModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // </>
          }
          {selectedBook && !state.currentUser && <NavLink to="/login" className="btn bookshelfButton">Log in to add to your bookshelf!</NavLink>}
        </div>
        {selectedBook && (
          <div className="book-details">
            <div key={selectedBook.id} className="cardPadding col-md-4">
              <div className="details-card text-center">

                <img className="cardImage card-img-top" src={selectedBook.volumeInfo.imageLinks?.smallThumbnail} alt="bookImage" />
                <div className="card-body">
                  <h5 className="card-title">{selectedBook.volumeInfo.title}</h5>
                  <p className="card-text">{selectedBook.volumeInfo.authors[0]}</p>
                  <p className="card-text text-muted">{selectedBook.volumeInfo.industryIdentifiers[0].type}</p>
                  <p className="card-text text-muted">{selectedBook.volumeInfo.industryIdentifiers[0].identifier}</p>
                  <p className="card-text">{selectedBook.volumeInfo.publisher}</p>
                  <p className="card-text">{selectedBook.volumeInfo.publishedDate}</p>
                  <p className="card-text">{selectedBook.volumeInfo.description}</p>
                  <a href={selectedBook.volumeInfo.previewLink}>Preview Book!</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookRandomizer;