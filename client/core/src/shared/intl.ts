import { connect, MapStateToPropsParam } from "react-redux";
import { IntlProvider } from "react-intl";

const mapStateToProps: MapStateToPropsParam<any, any, any> = (state: any): any => {
    const { locale, messages } = state.translations;
    return { locale, messages };
};

export default connect(mapStateToProps)(IntlProvider);