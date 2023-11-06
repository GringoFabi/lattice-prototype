import {SVG} from '@svgdotjs/svg.js';
import {createEffect, createMemo, createRenderEffect, onMount} from 'solid-js';
import './standard-node.css'
import {useTransContext} from '@mbarzda/solid-i18next';

const style = getComputedStyle(document.body);
const textSize = 16;

const StandardNode = ({colors}) => {
    const svgContainer = createMemo(() => SVG().id('svg-container'), []);
    let svgWrapper;

    const [t, {getI18next}] = useTransContext();
    let topLabel, bottomLabel, valueLabel, topHalf, bottomHalf;
    onMount(() => {
        topLabel = svgContainer().text(String(t('property')))
            .attr('name', (style.getPropertyValue('--label-upper-indicator') + 'Property'))
            .move(0, 0)
            .font({fill: colors()['top-label'], size: textSize, family: 'Arial'})

        bottomLabel = svgContainer().text(String(t('article')))
            .attr('name', (style.getPropertyValue('--label-lower-indicator') + 'Article'))
            .move(10, 60)
            .font({fill: colors()['bottom-label'], size: textSize, family: 'Arial'})

        valueLabel = svgContainer().text(String('0'))
            .move(55, 30)
            .font({fill: colors()['value-label'], size: textSize, family: 'Arial'})

        topHalf = svgContainer().path('M 0 0 L 20 0 A 1 1 0 0 0 -20 0 Z')
            .attr('name', 'Property')
            .attr('drag', 0)
            .move(10, 20)
            .stroke({color: style.getPropertyValue('--default-black'), width: 3, linecap: 'round', linejoin: 'round'})
            .fill(colors()['top-half'])

        bottomHalf = svgContainer().path('M 0 0 L -20 0 A 1 1 0 0 0 20 0 Z')
            .attr('name', 'Article')
            .attr('drag', 0)
            .move(10, 40)
            .stroke({color: style.getPropertyValue('--default-black'), width: 3, linecap: 'round', linejoin: 'round'})
            .fill(colors()['bottom-half'])
    })

    getI18next().on('languageChanged', () => {
        topLabel.node.textContent = t('property');
        bottomLabel.node.textContent = t('article');
    })

    createEffect(() => svgContainer().addTo(svgWrapper))
    createRenderEffect(() => {
        const updatedColors = colors();
        if (topLabel) topLabel.fill(updatedColors['top-label']);
        if (bottomLabel) bottomLabel.fill(updatedColors['bottom-label']);
        if (valueLabel) valueLabel.fill(updatedColors['value-label']);
        if (topHalf) topHalf.fill(updatedColors['top-half']);
        if (bottomHalf) bottomHalf.fill(updatedColors['bottom-half']);
    })

    return (
        <div className="standard-node" ref={ref => svgWrapper = ref}></div>
    )
}

export default StandardNode