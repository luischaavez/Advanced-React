import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

export const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $image: String
        $largeImage: String
        $price: Int!
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0,
    }

    handleChange = (e) => {
        const { name, type, value } = e.target;

        const val = type === 'number' 
            ? parseFloat(value) : value;

        this.setState({ [name]: val });
    }

    uploadFile = async e => {
        console.log('Uploading file...');
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const response = await fetch(
            'https://api.cloudinary.com/v1_1/dbpltauc2/image/upload',
            {
                method: 'POST',
                body: data
            }
        );

        const file = await response.json();
        console.log(file);
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        })
    }

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error }) => (
                    <Form onSubmit={async e => {
                        // Stop the form from submitting.
                        e.preventDefault();
                        // call the mutation.
                        const res = await createItem();
                        // change them to the single item page.
                        console.log(res);
                        Router.push({
                            pathname: '/item',
                            query: { id: res.data.createItem.id }
                        })
                    }}>
                        <Error error={error}/>
                        <fieldset 
                            disabled={loading} 
                            aria-busy={loading}
                        >
                            <label htmlFor="file">
                                Image
                                <input 
                                    type="file" 
                                    id="file" 
                                    name="file" 
                                    onChange={this.uploadFile}
                                    placeholder="Upload an image" 
                                    required
                                />
                                { this.state.image && <img width="200" src={this.state.image} alt="Upload Preview"/> }
                            </label>

                            <label htmlFor="title">
                                Title
                                <input 
                                    type="text" 
                                    id="title" 
                                    name="title" 
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                    placeholder="Title" 
                                    required
                                />
                            </label>

                            <label htmlFor="price">
                                Price
                                <input 
                                    type="number" 
                                    id="price" 
                                    name="price" 
                                    value={this.state.price}
                                    onChange={this.handleChange}
                                    placeholder="Price" 
                                    required
                                />
                            </label>

                            <label htmlFor="description">
                                Description
                                <textarea
                                    id="description" 
                                    name="description" 
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    placeholder="Enter A Description" 
                                    required
                                />
                            </label>

                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItem;