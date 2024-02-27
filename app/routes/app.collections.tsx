import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react/dist/components';
import { Card, Layout, List, Page } from '@shopify/polaris';
import * as React from 'react';
import {apiVersion, authenticate } from '~/shopify.server';

const query = `
    {
        collections(first: 10){
            edges{
                node{
                    id
                    handle
                    title
                    description
                }
            }
            pageInfo {
                hasNextPage
            }
        }
    }
    `

export const loader: LoaderFunction = async ({ request }) => {
    const {session} = await authenticate.admin(request);
    const {shop, accessToken} = session;

    try {
        const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/graphql",
                "X-Shopify-Access-Token": accessToken!
            },
            body: query

        });

        console.log(response);
        

        if(response.ok){
            const data = await response.json()

            const {
                data: {
                    collections: { edges }  
                }
            } = data;
            return edges
        }
    } catch (error) {
        console.log(error);
        
    }
    return null
}


const Collections = () => {
    const collections: any = useLoaderData()
    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Card>
                        <h1>
                            Hello World
                        </h1>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card>
                        <List type='bullet' gap='loose'>
                            {
                            collections.map((edge:any) => {
                                const {node: collection} = edge
                                console.log(edge.node, 'edge')
                                
                                return (
                                    <List.Item key={collection.id}>
                                        <h2>{collection.title}</h2>
                                        <p>{collection.description}</p>
                                    </List.Item>
                                )
                            })
                            }
                        </List>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default Collections