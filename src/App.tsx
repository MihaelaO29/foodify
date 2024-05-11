import './App.css';
import { SetStateAction, useState } from 'react';
import logo from './img/logo.png';
import bookmark from './img/bookmark.png';
import magnifier from './img/search.png';
import food_img1 from './img/food1.jpg';
import food_img2 from './img/food2.jpg';
import food_img3 from './img/food3.jpg';
import food_img4 from './img/food4.jpg';
import axios from 'axios';
import _ from 'lodash';

function App() {
  const API = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
  const KEY = '3292433c-46b7-40be-bc23-e568af71e2ab';
  const [search, setSearch] = useState('');
  const [allRecipes, setAllRecipes] = useState<any[]>([]);

  const handleSearchContent = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearch(event?.target?.value)
  }

  const fetchRecipes = async () => {
    const recipes = await axios
      .get(`${API}?key=${KEY}&search=${search}`)
      .then(respone => respone.data)
      .then(respone => respone.data)
      .then(respone => respone.recipes)
    if (!_.isEmpty(recipes)) {
      setAllRecipes(recipes);
    }
  }

  return (
    <div>
      <div className='background'>
        <div className='application'>
          <div className='nav'>
            <img className='logo' src={logo} alt='logo' />
            <div className='search'>
              <input onChange={handleSearchContent} className='search_input' placeholder='Search recipes' />

              <button className='search_btn' onClick={fetchRecipes}> <img src={magnifier} alt='magnifier' /> Search</button>
            </div>
            <div className='bookmark'>
              <img src={bookmark} alt='bookmark' />
              BOOKMARKS
            </div>

          </div>
          <div className='content'>
            <div className='recipes_list'>
              {_.isEmpty(allRecipes) ? (
                <div className='instructions'>
                  <p> Start by searching for a <br /> recipe or an ingredient.</p>
                  <p> Have fun! </p>
                </div>
              ) : (
                <div className='recipe_item_list'>
                  <div className='list'>
                    {allRecipes.map((recipe) =>
                      <div className='item_list' key={recipe.id}>
                        <div className='recipe_product_image'>
                          <img className='product_image' src={recipe.image_url} alt="Content" />
                        </div>
                        <div className='recipe_details'>
                          <div className='recipe_title'>{recipe.title.toUpperCase()}</div>
                          <p className='recipe_difficulty'>{recipe.publisher.toUpperCase()} </p>
                        </div>
                      </div>
                    )
                    }
                  </div>
                </div>
              )}
            </div>
            <div className='image_section'>
              <img className='food_image' src={food_img1} alt='food_image' />
              <img className='food_image' src={food_img2} alt='food_image' />
              <img className='food_image' src={food_img3} alt='food_image' />
              <img className='food_image' src={food_img4} alt='food_image' />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
