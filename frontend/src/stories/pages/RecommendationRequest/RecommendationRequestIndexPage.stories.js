import React from 'react';
import { apiCurrentUserFixtures } from 'fixtures/currentUserFixtures';
import { systemInfoFixtures } from 'fixtures/systemInfoFixtures';
import { rest } from 'msw';

import RecommendationRequestIndexPage from 'main/pages/RecommendationRequest/RecommendationRequestIndexPage';
import { ThreeItemsOrdinaryUser } from '../Restaurants/RestaurantIndexPage.stories';
import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';

export default {
    title: 'pages/RecommendationRequest/RecommendationRequestIndexPage',
    component: RecommendationRequestIndexPage
};

const Template = () => <RecommendationRequestIndexPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/recommendationRequests/all', (_req, res, ctx) => {
            return res(ctx.json({}));
        }),
    ]
}

export const ThreeItems = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/recommendationRequests/all', (_req, res, ctx) => {
            return res(ctx.json(recommendationRequestFixtures.threeRecommendationRequests[0]));
        }),
    ],
}

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/recommendationRequests/all', (_req, res, ctx) => {
            return res(ctx.json(recommendationRequestFixtures.threeRecommendationRequests[0]));
        }),
        rest.delete('/api/recommendationRequests', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}