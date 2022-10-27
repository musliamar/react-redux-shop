### React Frontend test for scandiweb

#### Update 27-10-2022

Based on feedback, these things **are fixed**:

- Please dont use dangerouslySetInnerHtml or sanitize data, it have this name for a reason - **done**, used html-react-parser instead of dangerouslySetInnerHtml
- Price shouldn’t be multiplied by qty - **done**
- Selected currency is not highlighted - **done**
- Price should always have 2 digits after dot - **done**, added .toFixed(2) on price display
- On first page load is requested all data and is saved in local storage, that’s wrong approach. On category page should happen current category request and on product page current product request. to always get updated data - **done**, on first page load only necessary data is requested (lists of categories and currencies and their default values).

**Still to fix**:

- Wrong font was used
- Full product card should be clickable
- Out of stock labels not implemented
- Out of stock products should have same labels on PDP as on PLP
- Not possible to distinguish white color
- Please use variable destructuring
- Please don’t use style prop for static styles

This is my project for scandiweb.

Project is ready for review.

From link: https://www.notion.so/Entry-React-developer-TEST-39f601f8aa3f48ac88c4a8fefda304c1