import { ExtractJwt } from 'passport-jwt';

export const cookieExtractor = function(paramname: string) {
  return function(req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[paramname];
    }
    return token;
  };
};

export class FromRequestUtil {
  public static buid(types: Set<'body' | 'header' | 'query' | 'cookie'>) {
    const arrays = [];
    if (types) {
      for (const type of types) {
        const f = this.get(type);
        if (f) {
          arrays.push(f);
        }
      }
    }
    if (arrays.length > 0) {
      return ExtractJwt.fromExtractors(arrays);
    } else {
      return ExtractJwt.fromAuthHeaderAsBearerToken();
    }
  }

  public static get(type: 'body' | 'header' | 'query' | 'cookie') {
    switch (type) {
      case 'body':
        return ExtractJwt.fromBodyField('access_token');
        break;
      case 'header':
        return ExtractJwt.fromAuthHeaderAsBearerToken();
        break;
      case 'query':
        return ExtractJwt.fromUrlQueryParameter('access_token');
        break;
      case 'cookie':
        return cookieExtractor('access_token');
        break;
      default:
        return null;
        break;
    }
  }

  public static lookup(obj, field) {
    if (!obj) {
      return null;
    }
    const chain = field
      .split(']')
      .join('')
      .split('[');
    for (let i = 0, len = chain.length; i < len; i++) {
      const prop = obj[chain[i]];
      if (typeof prop === 'undefined') {
        return null;
      }
      if (typeof prop !== 'object') {
        return prop;
      }
      obj = prop;
    }
    return null;
  }
}
