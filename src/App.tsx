import './App.css';
import { SetStateAction, useState, useEffect } from 'react';
import logo from './img/logo.png';
import bookmark from './img/bookmark.png';
import magnifier from './img/search.png';
import food_img1 from './img/food1.jpg';
import food_img2 from './img/food2.jpg';
import food_img3 from './img/food3.jpg';
import food_img4 from './img/food4.jpg';
import time from './img/time.png';
import user from './img/user.png';
import mark from './img/mark.png';
import markSaved from './img/mark_saved.png';
import check from './img/check.png'
import axios from 'axios';
import _ from 'lodash';

function App() {
  const API = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
  const KEY = '3292433c-46b7-40be-bc23-e568af71e2ab';

  const itemsPerPage = 10;
  const [search, setSearch] = useState('');
  const [allRecipes, setAllRecipes] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [recipesDetails, setRecipesDetails] = useState<any>({});
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [savedBookmarks, setSavedBookmaks] = useState<any[]>([]);

  useEffect(() => {
    if (!_.isEmpty(savedBookmarks)) {
      localStorage.setItem('mark', JSON.stringify(savedBookmarks));
    }
  }, [savedBookmarks]);

  useEffect(() => {
    setSavedBookmaks(JSON.parse(localStorage.getItem('mark') + ''))
  }, []);

  const handleSearchContent = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearch(event?.target?.value)
  }

  const fetchRecipes = async () => {
    const recipes = await axios
      .get(`${API}?key=${KEY}&search=${search}`)
      .then(respone => respone.data)
      .then(respone => respone.data)
      .then(respone => respone.recipes)
    setSearch('')
    if (!_.isEmpty(recipes)) {
      setAllRecipes(recipes);
    }
  }

  const fetchRecipesDetails = async (id: string) => {
    if (id) {
      const recipe = await axios
        .get(`${API}${id}?key=${KEY}`)
        .then(respone => respone.data)
        .then(respone => respone.data)
        .then(respone => respone.recipe)
      setRecipesDetails(recipe)
    }
  }

  const handleBackPage = () => {
    setPage(page - 1)
  }

  const handleNextPage = () => {
    setPage(page + 1)
  }


  const handleMouseOver = () => {
    setShowBookmarks(true);
  }

  const handleMouseOut = () => {
    setShowBookmarks(false);
  }

  const handleSaveBookmarks = (id: any) => {
    const check = savedBookmarks.filter(recipe => recipe.id === id)
    if (!_.isEmpty(check)) {
      const newArr = [...savedBookmarks];
      const checkNewArr = newArr.filter(recipe => recipe.id !== id)
      if (_.isEmpty(checkNewArr)) {
        localStorage.setItem('mark', JSON.stringify([]));
      }
      setSavedBookmaks(checkNewArr)
    } else {
      setSavedBookmaks([...savedBookmarks, recipesDetails])
    }
  }

  const handleLogoClick = () => {
    setAllRecipes([]);
    setRecipesDetails({});
    setPage(1);
    setSearch('');
  };


  return (
    <div>
      <div className='background'>
        <div className='application'>
          <div className='nav'>
            <img className='logo' src={logo} alt='logo' onClick={handleLogoClick} />
            <div className='search_section'>
              <input value={search} onChange={handleSearchContent} className='search_input' placeholder='Search recipes' />
              <div className='search'>
                <button className='search_btn' onClick={fetchRecipes}>
                  <img src={magnifier} alt='magnifier' /> Search</button>
              </div>

            </div>
            <div className='bookmark_section' >
              <div
                className='bookmark'
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <img className='bookmark_img' src={bookmark} alt='bookmark' />
                <button className='bookmark_btn'> BOOKMARKS </button>
              </div>

              {showBookmarks ?
                <div
                  className='all_saved_bookmarks'
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {_.isEmpty(savedBookmarks) ?
                    <div className='empty_bookmarks_message'>No bookmarks yet. Find a nice recipe and bookmark it. </div>
                    :
                    <div className='recipe_item_list'>
                      <div className='list'>{savedBookmarks.map((recipe: any) =>
                        <div onClick={() => fetchRecipesDetails(recipe.id)} className='item_list' >
                          <div className='recipe_product_image'>
                            <img className='product_image' src={recipe.image_url} alt="Content" />
                          </div>
                          <div className='recipe_details'>
                            <div className='recipe_title'>{recipe.title}</div>
                            <p className='recipe_difficulty'>{recipe.publisher} </p>
                          </div>
                        </div>)}
                      </div>
                    </div>}
                </div>
                : ''}
            </div>
          </div>

          <div className='content'>
            <div className='recipes_list'>
              {_.isEmpty(allRecipes) ? (
                <div className='search_instructions'>
                  <p> Start by searching for a <br /> recipe or an ingredient.</p>
                  <p> Have fun! </p>
                </div>
              ) : (
                <div className='recipe_item_list'>
                  <div className='list'>
                    {allRecipes.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((recipe: any) =>
                      <div onClick={() => fetchRecipesDetails(recipe.id)} className='item_list' key={recipe.id}>
                        <div className='recipe_product_image'>
                          <img className='product_image' src={recipe.image_url} alt="Content" />
                        </div>
                        <div className='recipe_details'>
                          <div className='recipe_title'>{recipe.title.toUpperCase()}</div>
                          <p className='recipe_difficulty'>{recipe.publisher.toUpperCase()} </p>
                        </div>
                      </div>
                    )}

                  </div>
                  <div className='change_page_btn'>
                    {page > 1 ?
                      <button onClick={handleBackPage} className='change_btn'>Previous</button>
                      :
                      <button className='off_btn'></button>
                    }
                    {(page * itemsPerPage) <= allRecipes.length ?
                      (<button onClick={handleNextPage} className='change_btn'>Next</button>)
                      :
                      (<button className='off_btn'></button>)
                    }
                  </div>
                </div>
              )}
            </div>
            {(!_.isNil(recipesDetails) && !_.isEmpty(recipesDetails)) ? (
              <div className='recipe_instructions'>
                <div
                  style={{
                    backgroundImage: `url(${recipesDetails.image_url})`,
                  }}
                  className='recipe_image' >
                  <div className='background_color'></div>
                  <h1 className='recipe_instructions_title'>
                    <span className='recipe__title_span'> {recipesDetails.title} </span>
                  </h1>
                </div>
                <div className='recipe_time'>
                  <div className='time'>
                    <img src={time} alt='clock_image' /> {recipesDetails.cooking_time} MINUTES
                  </div>
                  <div className='recipe_servings'>
                    <img src={user} alt='user_image' />
                    {recipesDetails.servings} SERVINGS
                  </div>
                  <div onClick={() => handleSaveBookmarks(recipesDetails.id)} className='instructions_mark'>
                    <img
                      className='mark'
                      src={savedBookmarks && savedBookmarks.some(bk => bk.id === recipesDetails.id) ? markSaved : mark}
                      alt='instructions_mark'
                    />
                  </div>
                </div>
                <div className='recipe_ingredients_list'>
                  <p className='ingredients_title'>RECIPE INGREDIENTS</p>
                  <div className='ingredient_row'>
                    {recipesDetails?.ingredients?.map((ingredient: any, index: number) => (
                      <div className='all_ingredients' key={index}>
                        <img className='check' src={check} alt="Check icon" />
                        <span className='ingredient'>
                          {(ingredient.quantity || '') + ' ' + ingredient.unit + ' ' + ingredient.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className='image_section'>
                <img className='food_image' src={food_img1} alt='food_image' />
                <img className='food_image' src={food_img2} alt='food_image' />
                <img className='food_image' src={food_img3} alt='food_image' />
                <img className='food_image' src={food_img4} alt='food_image' />
              </div>)}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
