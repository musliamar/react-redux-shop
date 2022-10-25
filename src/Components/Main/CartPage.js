import React from 'react';
import './CartPage.css';
import ArrowLeft from '../../Images/arrow-left.svg';
import ArrowRight from '../../Images/arrow-right.svg';
import {Link} from 'react-router-dom';

class CartPage extends React.Component {

    state = {
        currentImages: [],
        style: {objectPosition: '0% 0%'},
        overId: ''
      };


    handleMouseMove = (event) => {
        const { left, width, height } = event.target.getBoundingClientRect()
        const top = event.target.getBoundingClientRect().top + window.scrollY;
        const x = (event.pageX - left) / width * 100
        const y = (event.pageY - top) / height * 100
        this.setState({style: {objectPosition: `${x}% ${y}%` }})
    }

    handleMouseLeave = () => {
        this.setState({overId: '', style: {objectPosition: '0% 0%' }})
    }

    setOverId = (props) => {
        this.setState({overId: props})
    }

    nextImage = (props) => {

        const {currentImages} = this.state;
        const {item, gallery} = props;

        if(currentImages.length === 0){
            const array = [];
            array.push({ item: item, currentImage: 1 })
            this.setState({currentImages: array});
        }else{
            currentImages.forEach((image) => {
                const array = currentImages;
                    if(image.item === item){
                    if((gallery.length - 1) === image.currentImage){
                        array.push({ item: item, currentImage: 0 })
                    }else{
                        const hold = image.currentImage
                        array.push({ item: item, currentImage: hold + 1 })
                    }
                    this.setState({currentImages: array});
                    array.splice(array.indexOf(image), 1);
                }else{
                    array.push({ item: item, currentImage: 1 })
                    this.setState({currentImages: array});
                    array.splice(array.indexOf(image), 1);
                }
            })
        }
        this.setState({style: {objectPosition: '0% 0%' }})
    }

    previousImage = (props) => {

        const {currentImages} = this.state;
        const {item, gallery} = props;

        if(currentImages.length === 0){
            const array = [];
            array.push({ item: item, currentImage: gallery.length - 1 })
            this.setState({currentImages: array});
        }else{
            currentImages.forEach((image) => {
                const array = currentImages;
                if(image.item === item){
                    if(image.currentImage === 0){
                        array.push({ item: item, currentImage: gallery.length - 1 })
                    }else{
                        const hold = image.currentImage
                        array.push({ item: item, currentImage: hold - 1 })
                    }
                    this.setState({currentImages: array});
                    array.splice(array.indexOf(image), 1);
                }else{
                    array.push({ item: item, currentImage: gallery.length - 1 })
                    this.setState({currentImages: array});
                    array.splice(array.indexOf(image), 1);
                }
            })
        }
        this.setState({style: {objectPosition: '0% 0%' }})
    } 
      
    render() {
        const {
            itemsInBag, 
            choosenCurrency, 
            currencyToShow,
            sumOfPrices,
            numberOfItemsInBag,
            generateListOfAttributes, 
            increaseQuantityOfProduct,
            removeFromBag } = this.props;

            const {currentImages, overId, style} = this.state;

            const taxRaw = 0.21 * sumOfPrices;
            const tax = taxRaw.toFixed(2);
            const sumRaw = parseFloat(sumOfPrices) + taxRaw;
            const sum = sumRaw.toFixed(2);

      return (
        
        <div className='cart-container'>
            <h1 className='cart-title'>Cart</h1>
            <div className='cart-page-items'>
            {!(itemsInBag.length === 0)
            ? <>
                {itemsInBag && itemsInBag.map((item) => {

                const toCompare = {item: item.cartId, gallery: item.gallery};

                let imageToShow = 0;

                if(!(currentImages.length === 0)){
                    currentImages.forEach((image) => {
                        if(image.item === item.cartId){
                            imageToShow = image.currentImage;
                        }
                    })
                }else{
                    imageToShow = 0;
                }
                
                const attributes = {attributes: item.attributes, choosenAttributes: item.choosenAttributes, from: 'cart'};

                return (
                    <div key={item.cartId}>
                        <div className='divider'></div>
                        <div className='single'>
                            <div className='summary'>
                                <div className='brand-name'>
                                    <Link 
                                    key={item.id} 
                                    to={'/'+item.category+'/'+item.id}>
                                        <span className='brand'>{item.brand}</span>
                                        <span className='name'>{item.name}</span>
                                    </Link>
                                </div>
                                <div className='price'>
                                    <span style={{fontWeight: 'normal', fontSize: 14}}>per unit {choosenCurrency && choosenCurrency.symbol}{item.prices[currencyToShow] && item.prices[currencyToShow].amount}</span>
                                    <span>{choosenCurrency && choosenCurrency.symbol}{item.sumPriceOfItemFixed}</span>
                                </div>
                                <div className='attributes'>
                                    {generateListOfAttributes(attributes)}  
                                </div>
                            </div>
                            <div className='quantity'>
                                <span onClick={() => {increaseQuantityOfProduct(item.cartId)}} className='attribute-option plus-minus'>
                                +
                                </span>
                                <span className='attribute-number'>
                                    {item.quantity}
                                </span>
                                <span onClick={() => {removeFromBag(item.cartId)}} className='attribute-option plus-minus'>
                                -
                                </span>
                            </div>
                            <div className='gallery'>
                                {item.gallery.length > 1
                                ? <>
                                    <div onMouseEnter={() => {this.setOverId(item.cartId)}} onMouseLeave={this.handleMouseLeave} className='item-image-wrapper'>
                                        <div>
                                            <img 
                                            alt={item.name+' product'}
                                            onMouseMove={this.handleMouseMove}
                                            style={(overId === item.cartId) ? style : null} 
                                            className='item-image' 
                                            src={item.gallery[imageToShow]} />
                                        </div>
                                        <div>
                                            <div className='gallery-arrows'>
                                                <img onClick={() => {this.previousImage(toCompare)}} className='gallery-arrow-icon' src={ArrowLeft} alt='Previous'/>
                                                <img onClick={() => {this.nextImage(toCompare)}} className='gallery-arrow-icon' src={ArrowRight} alt='Next'/>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                : <div onMouseEnter={() => this.setOverId(item.cartId)} onMouseLeave={this.handleMouseLeave} className='item-image-wrapper'>
                                    <img 
                                    alt={item.name+' product'} 
                                    className='item-image' 
                                    onMouseMove={this.handleMouseMove} 
                                    style={(overId === item.cartId) ? style : null} 
                                    src={item.gallery[0]} />
                                </div>} 
                            </div>
                        </div>
                    </div>
                )})}
                <div className='divider'></div>
                <div className='price-summary'>
                    <div className='labels'>
                        <span>Tax 21%:</span>
                        <span>Quantity:</span>
                        <span>Total:</span>
                    </div>
                    <div className='values'>
                        <span className='bold'>{choosenCurrency && choosenCurrency.symbol}{tax}</span>
                        <span className='bold'>{numberOfItemsInBag}</span>
                        <span className='bold'>{choosenCurrency && choosenCurrency.symbol}{sum}</span>
                    </div>
                </div>
                <div className='wide-green-button'>
                    <span>Order</span>
                </div>
            </>
            : <span>Your cart is currently empty.</span>}
            </div>
        </div>
    );
  }}

  export default CartPage;