import React from 'react'
import {useWindowDimensions, StyleSheet} from "react-native";
import RenderHtml, {HTMLElementModel, HTMLContentModel, defaultSystemFonts} from 'react-native-render-html';

const customHTMLElementModels = {
    't': HTMLElementModel.fromCustomModel({
        tagName: 't',
        contentModel: HTMLContentModel.textual
    }),
    'p': HTMLElementModel.fromCustomModel({
        contentModel: HTMLContentModel.block
    })
};

function WebDisplay(props) {
    const {width: contentWidth} = useWindowDimensions();
    const propsBaseStyles = {
        fontFamily: 'Gilroy-Regular',
        color: 'black', ...StyleSheet.flatten(props.baseFontStyle), ...StyleSheet.flatten(props.containerStyle)
    }
    const renderersProps = {
        a: {
            onPress(event, url, htmlAttribs, target) {
                props.onLinkPress(event, htmlAttribs.href)
            }
        }
    }
    const tagsStyles = React.useMemo(
        () => (props.tagsStyles),
        [],
    );

    const systemFonts = defaultSystemFonts;

    const classStyles = React.useMemo(
        () => (props.classStyles),
        [],
    )

    const { onLinkPress, ...otherProps } = props || {};

    return (
        <RenderHtml
            contentWidth={contentWidth}
            baseStyle={propsBaseStyles}
            tagsStyles={tagsStyles}
            renderersProps={renderersProps}
            classesStyles={classStyles}
            customHTMLElementModels={customHTMLElementModels}
            systemFonts={systemFonts}
            {...otherProps}
        />
    );
}

export default React.memo(WebDisplay)
