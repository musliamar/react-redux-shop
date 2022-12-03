import { Component } from 'react';
import { update } from '../../Store';
import { connect } from "react-redux";

class Attributes extends Component {

    selectAttribute({id, item}){
        const { choosenAttributes, update } = this.props;
        let newArray = [];
    
        choosenAttributes.forEach((key) =>
            {if(Object.keys(key)[0] === id){
              newArray.push({[id]: item})
            }else{
              newArray.push({[Object.keys(key)[0]]: Object.values(key)[0]})
            }}
        )
        update({name: 'choosenAttributes', value: newArray})
      }

    render() {

        const {
          attributes: arrayOfAttributes, 
          from, 
          choosenAttributes: attributesFromState, 
          choosenAttributesFromCart, 
          inStock} = this.props;

        return(arrayOfAttributes && arrayOfAttributes.map((attribute, index) => {
    
          let newAttribute = JSON.parse(JSON.stringify(attribute));
          let selectingEnabled = false;
          let choosenAttributes = from === 'product-page' ? attributesFromState : choosenAttributesFromCart;

          if(from === 'product-page'){inStock ? selectingEnabled = true : selectingEnabled = false}

          for(const choosenAttribute in choosenAttributes){
            const attributeToCompare = choosenAttributes[choosenAttribute];
            const {id} = attribute;
            if(attributeToCompare[id]){
              newAttribute.selectedValue = attributeToCompare[id];
            }
          }
    
          const {id: attributeId, name, items, type, selectedValue} = newAttribute;
          const {id: valueId} = selectedValue;
    
          return (<div key={attributeId} className='attribute'>
                    <span className={inStock ? 'attribute-name' : 'attribute-name bleached-text'}>{name}:</span>
                    <div className='attribute-options'>
                      {items && items.map((item) => {
                        const {id: itemId, value} = item;
                        return (
                          type === 'swatch'
                          ? (selectedValue && itemId === valueId) 
                            ? <span 
                                key={itemId} 
                                style={selectingEnabled? {cursor: 'pointer', backgroundColor: value} : {backgroundColor: value}} 
                                onClick={selectingEnabled ? () => this.selectAttribute({id: attributeId, item: item}) : null} 
                                className={inStock ? 'attribute-option swatch selected' : 'attribute-option swatch opacity'}>
                              </span>
                            : <span 
                                key={itemId} 
                                style={selectingEnabled? {cursor: 'pointer', backgroundColor: value} : {backgroundColor: value}} 
                                onClick={selectingEnabled ? () => this.selectAttribute({id: attributeId, item: item}) : null} 
                                className={inStock ? 'attribute-option swatch' : 'attribute-option swatch opacity'}>
                              </span>
                          : (selectedValue && itemId === valueId) 
                            ? <span 
                                key={itemId} 
                                style={selectingEnabled ? {cursor: 'pointer'} : null} 
                                onClick={selectingEnabled ? () => this.selectAttribute({id: attributeId, item: item}) : null} 
                                className={inStock ? 'attribute-option text selected' : 'attribute-option text out-of-stock'}>
                                  {value}
                              </span>
                            : <span 
                                key={itemId} 
                                style={selectingEnabled ? {cursor: 'pointer'} : null} 
                                onClick={selectingEnabled ? () => this.selectAttribute({id: attributeId, item: item}) : null} 
                                className={inStock ? 'attribute-option text' : 'attribute-option text out-of-stock'}>
                                  {value}
                              </span>
                        )})}
                    </div>
                  </div>)
        }))
  }}

const mapStateToProps = (state) => ({
    choosenAttributes: state.choosenAttributes
})

const mapDispatchToProps = () => ({ 
    update
});
  
export default connect(mapStateToProps, mapDispatchToProps())(Attributes);
  