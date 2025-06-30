import React from 'react';
import { DeathNewsDetailComp } from '../Components';

export default function DeathNewsDetail(props) {
    const DetailDeathNews = props.route.params.DetailDeathNews
    return <DeathNewsDetailComp DetailDeathNews={DetailDeathNews} />
}