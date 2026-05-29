var hu=Object.defineProperty;var vu=(n)=>n;function bu(n,r){this[n]=vu.bind(null,r)}var _n=(n,r)=>{for(var i in r)hu(n,i,{get:r[i],enumerable:!0,configurable:!0,set:bu.bind(r,i)})};var Y=(n,r)=>()=>(n&&(r=n(n=0)),r);var Vu={};_n(Vu,{useState:()=>w,useRef:()=>Z,useReducer:()=>W_,useMemo:()=>D,useLayoutEffect:()=>kr,useImperativeHandle:()=>Ru,useErrorBoundary:()=>Hu,useEffect:()=>P,useDebugValue:()=>Uu,useContext:()=>Tu,useCallback:()=>T,render:()=>An,html:()=>l,h:()=>ni,createContext:()=>ju,Component:()=>nr});function vn(n,r){for(var i in r)n[i]=r[i];return n}function ar(n){n&&n.parentNode&&n.parentNode.removeChild(n)}function ni(n,r,i){var _,c,u,f={};for(u in r)u=="key"?_=r[u]:u=="ref"?c=r[u]:f[u]=r[u];if(arguments.length>2&&(f.children=arguments.length>3?zr.call(arguments,2):i),typeof n=="function"&&n.defaultProps!=null)for(u in n.defaultProps)f[u]===void 0&&(f[u]=n.defaultProps[u]);return hr(n,f,_,c,null)}function hr(n,r,i,_,c){var u={type:n,props:r,key:i,ref:_,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:c==null?++t_:c,__i:-1,__u:0};return c==null&&E.vnode!=null&&E.vnode(u),u}function Br(n){return n.children}function nr(n,r){this.props=n,this.context=r}function Xn(n,r){if(r==null)return n.__?Xn(n.__,n.__i+1):null;for(var i;r<n.__k.length;r++)if((i=n.__k[r])!=null&&i.__e!=null)return i.__e;return typeof n.type=="function"?Xn(n):null}function zu(n){if(n.__P&&n.__d){var r=n.__v,i=r.__e,_=[],c=[],u=vn({},r);u.__v=r.__v+1,E.vnode&&E.vnode(u),ri(n.__P,u,r,n.__n,n.__P.namespaceURI,32&r.__u?[i]:null,_,i==null?Xn(r):i,!!(32&r.__u),c),u.__v=r.__v,u.__.__k[u.__i]=u,z_(_,u,c),r.__e=r.__=null,u.__e!=i&&b_(u)}}function b_(n){if((n=n.__)!=null&&n.__c!=null)return n.__e=n.__c.base=null,n.__k.some(function(r){if(r!=null&&r.__e!=null)return n.__e=n.__c.base=r.__e}),b_(n)}function dr(n){(!n.__d&&(n.__d=!0)&&kn.push(n)&&!Kr.__r++||r_!=E.debounceRendering)&&((r_=E.debounceRendering)||y_)(Kr)}function Kr(){try{for(var n,r=1;kn.length;)kn.length>r&&kn.sort(x_),n=kn.shift(),r=kn.length,zu(n)}finally{kn.length=Kr.__r=0}}function p_(n,r,i,_,c,u,f,o,s,$,b){var g,p,h,v,F,y,K,W=_&&_.__k||pr,N=r.length;for(s=Fu(i,r,W,s,N),g=0;g<N;g++)(h=i.__k[g])!=null&&(p=h.__i!=-1&&W[h.__i]||br,h.__i=g,y=ri(n,h,p,c,u,f,o,s,$,b),v=h.__e,h.ref&&p.ref!=h.ref&&(p.ref&&ii(p.ref,null,h),b.push(h.ref,h.__c||v,h)),F==null&&v!=null&&(F=v),(K=!!(4&h.__u))||p.__k===h.__k?(s=K_(h,s,n,K),K&&p.__e&&(p.__e=null)):typeof h.type=="function"&&y!==void 0?s=y:v&&(s=v.nextSibling),h.__u&=-7);return i.__e=F,s}function Fu(n,r,i,_,c){var u,f,o,s,$,b=i.length,g=b,p=0;for(n.__k=Array(c),u=0;u<c;u++)(f=r[u])!=null&&typeof f!="boolean"&&typeof f!="function"?(typeof f=="string"||typeof f=="number"||typeof f=="bigint"||f.constructor==String?f=n.__k[u]=hr(null,f,null,null,null):Fr(f)?f=n.__k[u]=hr(Br,{children:f},null,null,null):f.constructor===void 0&&f.__b>0?f=n.__k[u]=hr(f.type,f.props,f.key,f.ref?f.ref:null,f.__v):n.__k[u]=f,s=u+p,f.__=n,f.__b=n.__b+1,o=null,($=f.__i=Bu(f,i,s,g))!=-1&&(g--,(o=i[$])&&(o.__u|=2)),o==null||o.__v==null?($==-1&&(c>b?p--:c<b&&p++),typeof f.type!="function"&&(f.__u|=4)):$!=s&&($==s-1?p--:$==s+1?p++:($>s?p--:p++,f.__u|=4))):n.__k[u]=null;if(g)for(u=0;u<b;u++)(o=i[u])!=null&&(2&o.__u)==0&&(o.__e==_&&(_=Xn(o)),B_(o,o));return _}function K_(n,r,i,_){var c,u;if(typeof n.type=="function"){for(c=n.__k,u=0;c&&u<c.length;u++)c[u]&&(c[u].__=n,r=K_(c[u],r,i,_));return r}n.__e!=r&&(_&&(r&&n.type&&!r.parentNode&&(r=Xn(n)),i.insertBefore(n.__e,r||null)),r=n.__e);do r=r&&r.nextSibling;while(r!=null&&r.nodeType==8);return r}function Bu(n,r,i,_){var c,u,f,o=n.key,s=n.type,$=r[i],b=$!=null&&(2&$.__u)==0;if($===null&&o==null||b&&o==$.key&&s==$.type)return i;if(_>(b?1:0)){for(c=i-1,u=i+1;c>=0||u<r.length;)if(($=r[f=c>=0?c--:u++])!=null&&(2&$.__u)==0&&o==$.key&&s==$.type)return f}return-1}function i_(n,r,i){r[0]=="-"?n.setProperty(r,i==null?"":i):n[r]=i==null?"":typeof i!="number"||Ku.test(r)?i:i+"px"}function yr(n,r,i,_,c){var u,f;n:if(r=="style")if(typeof i=="string")n.style.cssText=i;else{if(typeof _=="string"&&(n.style.cssText=_=""),_)for(r in _)i&&r in i||i_(n.style,r,"");if(i)for(r in i)_&&i[r]==_[r]||i_(n.style,r,i[r])}else if(r[0]=="o"&&r[1]=="n")u=r!=(r=r.replace(h_,"$1")),f=r.toLowerCase(),r=f in n||r=="onFocusOut"||r=="onFocusIn"?f.slice(2):r.slice(2),n.l||(n.l={}),n.l[r+u]=i,i?_?i[an]=_[an]:(i[an]=mr,n.addEventListener(r,u?Er:Jr,u)):n.removeEventListener(r,u?Er:Jr,u);else{if(c=="http://www.w3.org/2000/svg")r=r.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(r!="width"&&r!="height"&&r!="href"&&r!="list"&&r!="form"&&r!="tabIndex"&&r!="download"&&r!="rowSpan"&&r!="colSpan"&&r!="role"&&r!="popover"&&r in n)try{n[r]=i==null?"":i;break n}catch(o){}typeof i=="function"||(i==null||i===!1&&r[4]!="-"?n.removeAttribute(r):n.setAttribute(r,r=="popover"&&i==1?"":i))}}function __(n){return function(r){if(this.l){var i=this.l[r.type+n];if(r[xr]==null)r[xr]=mr++;else if(r[xr]<i[an])return;return i(E.event?E.event(r):r)}}}function ri(n,r,i,_,c,u,f,o,s,$){var b,g,p,h,v,F,y,K,W,N,B,U,z,j,X,t=r.type;if(r.constructor!==void 0)return null;128&i.__u&&(s=!!(32&i.__u),u=[o=r.__e=i.__e]),(b=E.__b)&&b(r);n:if(typeof t=="function")try{if(K=r.props,W=t.prototype&&t.prototype.render,N=(b=t.contextType)&&_[b.__c],B=b?N?N.props.value:b.__:_,i.__c?y=(g=r.__c=i.__c).__=g.__E:(W?r.__c=g=new t(K,B):(r.__c=g=new nr(K,B),g.constructor=t,g.render=Wu),N&&N.sub(g),g.state||(g.state={}),g.__n=_,p=g.__d=!0,g.__h=[],g._sb=[]),W&&g.__s==null&&(g.__s=g.state),W&&t.getDerivedStateFromProps!=null&&(g.__s==g.state&&(g.__s=vn({},g.__s)),vn(g.__s,t.getDerivedStateFromProps(K,g.__s))),h=g.props,v=g.state,g.__v=r,p)W&&t.getDerivedStateFromProps==null&&g.componentWillMount!=null&&g.componentWillMount(),W&&g.componentDidMount!=null&&g.__h.push(g.componentDidMount);else{if(W&&t.getDerivedStateFromProps==null&&K!==h&&g.componentWillReceiveProps!=null&&g.componentWillReceiveProps(K,B),r.__v==i.__v||!g.__e&&g.shouldComponentUpdate!=null&&g.shouldComponentUpdate(K,g.__s,B)===!1){r.__v!=i.__v&&(g.props=K,g.state=g.__s,g.__d=!1),r.__e=i.__e,r.__k=i.__k,r.__k.some(function(H){H&&(H.__=r)}),pr.push.apply(g.__h,g._sb),g._sb=[],g.__h.length&&f.push(g);break n}g.componentWillUpdate!=null&&g.componentWillUpdate(K,g.__s,B),W&&g.componentDidUpdate!=null&&g.__h.push(function(){g.componentDidUpdate(h,v,F)})}if(g.context=B,g.props=K,g.__P=n,g.__e=!1,U=E.__r,z=0,W)g.state=g.__s,g.__d=!1,U&&U(r),b=g.render(g.props,g.state,g.context),pr.push.apply(g.__h,g._sb),g._sb=[];else do g.__d=!1,U&&U(r),b=g.render(g.props,g.state,g.context),g.state=g.__s;while(g.__d&&++z<25);g.state=g.__s,g.getChildContext!=null&&(_=vn(vn({},_),g.getChildContext())),W&&!p&&g.getSnapshotBeforeUpdate!=null&&(F=g.getSnapshotBeforeUpdate(h,v)),j=b!=null&&b.type===Br&&b.key==null?F_(b.props.children):b,o=p_(n,Fr(j)?j:[j],r,i,_,c,u,f,o,s,$),g.base=r.__e,r.__u&=-161,g.__h.length&&f.push(g),y&&(g.__E=g.__=null)}catch(H){if(r.__v=null,s||u!=null)if(H.then){for(r.__u|=s?160:128;o&&o.nodeType==8&&o.nextSibling;)o=o.nextSibling;u[u.indexOf(o)]=null,r.__e=o}else{for(X=u.length;X--;)ar(u[X]);Sr(r)}else r.__e=i.__e,r.__k=i.__k,H.then||Sr(r);E.__e(H,r,i)}else u==null&&r.__v==i.__v?(r.__k=i.__k,r.__e=i.__e):o=r.__e=ku(i.__e,r,i,_,c,u,f,s,$);return(b=E.diffed)&&b(r),128&r.__u?void 0:o}function Sr(n){n&&(n.__c&&(n.__c.__e=!0),n.__k&&n.__k.some(Sr))}function z_(n,r,i){for(var _=0;_<i.length;_++)ii(i[_],i[++_],i[++_]);E.__c&&E.__c(r,n),n.some(function(c){try{n=c.__h,c.__h=[],n.some(function(u){u.call(c)})}catch(u){E.__e(u,c.__v)}})}function F_(n){return typeof n!="object"||n==null||n.__b>0?n:Fr(n)?n.map(F_):n.constructor!==void 0?null:vn({},n)}function ku(n,r,i,_,c,u,f,o,s){var $,b,g,p,h,v,F,y=i.props||br,K=r.props,W=r.type;if(W=="svg"?c="http://www.w3.org/2000/svg":W=="math"?c="http://www.w3.org/1998/Math/MathML":c||(c="http://www.w3.org/1999/xhtml"),u!=null){for($=0;$<u.length;$++)if((h=u[$])&&"setAttribute"in h==!!W&&(W?h.localName==W:h.nodeType==3)){n=h,u[$]=null;break}}if(n==null){if(W==null)return document.createTextNode(K);n=document.createElementNS(c,W,K.is&&K),o&&(E.__m&&E.__m(r,u),o=!1),u=null}if(W==null)y===K||o&&n.data==K||(n.data=K);else{if(u=W=="textarea"&&K.defaultValue!=null?null:u&&zr.call(n.childNodes),!o&&u!=null)for(y={},$=0;$<n.attributes.length;$++)y[(h=n.attributes[$]).name]=h.value;for($ in y)h=y[$],$=="dangerouslySetInnerHTML"?g=h:$=="children"||($ in K)||$=="value"&&("defaultValue"in K)||$=="checked"&&("defaultChecked"in K)||yr(n,$,null,h,c);for($ in K)h=K[$],$=="children"?p=h:$=="dangerouslySetInnerHTML"?b=h:$=="value"?v=h:$=="checked"?F=h:o&&typeof h!="function"||y[$]===h||yr(n,$,h,y[$],c);if(b)o||g&&(b.__html==g.__html||b.__html==n.innerHTML)||(n.innerHTML=b.__html),r.__k=[];else if(g&&(n.innerHTML=""),p_(r.type=="template"?n.content:n,Fr(p)?p:[p],r,i,_,W=="foreignObject"?"http://www.w3.org/1999/xhtml":c,u,f,u?u[0]:i.__k&&Xn(i,0),o,s),u!=null)for($=u.length;$--;)ar(u[$]);o&&W!="textarea"||($="value",W=="progress"&&v==null?n.removeAttribute("value"):v!=null&&(v!==n[$]||W=="progress"&&!v||W=="option"&&v!=y[$])&&yr(n,$,v,y[$],c),$="checked",F!=null&&F!=n[$]&&yr(n,$,F,y[$],c))}return n}function ii(n,r,i){try{if(typeof n=="function"){var _=typeof n.__u=="function";_&&n.__u(),_&&r==null||(n.__u=n(r))}else n.current=r}catch(c){E.__e(c,i)}}function B_(n,r,i){var _,c;if(E.unmount&&E.unmount(n),(_=n.ref)&&(_.current&&_.current!=n.__e||ii(_,null,r)),(_=n.__c)!=null){if(_.componentWillUnmount)try{_.componentWillUnmount()}catch(u){E.__e(u,r)}_.base=_.__P=null}if(_=n.__k)for(c=0;c<_.length;c++)_[c]&&B_(_[c],r,i||typeof n.type!="function");i||ar(n.__e),n.__c=n.__=n.__e=void 0}function Wu(n,r,i){return this.constructor(n,i)}function An(n,r,i){var _,c,u,f;r==document&&(r=document.documentElement),E.__&&E.__(n,r),c=(_=typeof i=="function")?null:i&&i.__k||r.__k,u=[],f=[],ri(r,n=(!_&&i||r).__k=ni(Br,null,[n]),c||br,br,r.namespaceURI,!_&&i?[i]:c?null:r.firstChild?zr.call(r.childNodes):null,u,!_&&i?i:c?c.__e:r.firstChild,_,f),z_(u,n,f)}function ju(n){function r(i){var _,c;return this.getChildContext||(_=new Set,(c={})[r.__c]=this,this.getChildContext=function(){return c},this.componentWillUnmount=function(){_=null},this.shouldComponentUpdate=function(u){this.props.value!=u.value&&_.forEach(function(f){f.__e=!0,dr(f)})},this.sub=function(u){_.add(u);var f=u.componentWillUnmount;u.componentWillUnmount=function(){_&&_.delete(u),f&&f.call(u)}}),i.children}return r.__c="__cC"+v_++,r.__=n,r.Provider=r.__l=(r.Consumer=function(i,_){return i.children(_)}).contextType=r,r}function Mn(n,r){S.__h&&S.__h(J,n,Qn||r),Qn=0;var i=J.__H||(J.__H={__:[],__h:[]});return n>=i.__.length&&i.__.push({}),i.__[n]}function w(n){return Qn=1,W_(j_,n)}function W_(n,r,i){var _=Mn(Wn++,2);if(_.t=n,!_.__c&&(_.__=[i?i(r):j_(void 0,r),function(o){var s=_.__N?_.__N[0]:_.__[0],$=_.t(s,o);s!==$&&(_.__N=[$,_.__[1]],_.__c.setState({}))}],_.__c=J,!J.__f)){var c=function(o,s,$){if(!_.__c.__H)return!0;var b=_.__c.__H.__.filter(function(p){return p.__c});if(b.every(function(p){return!p.__N}))return!u||u.call(this,o,s,$);var g=_.__c.props!==o;return b.some(function(p){if(p.__N){var h=p.__[0];p.__=p.__N,p.__N=void 0,h!==p.__[0]&&(g=!0)}}),u&&u.call(this,o,s,$)||g};J.__f=!0;var{shouldComponentUpdate:u,componentWillUpdate:f}=J;J.componentWillUpdate=function(o,s,$){if(this.__e){var b=u;u=void 0,c(o,s,$),u=b}f&&f.call(this,o,s,$)},J.shouldComponentUpdate=c}return _.__N||_.__}function P(n,r){var i=Mn(Wn++,3);!S.__s&&_i(i.__H,r)&&(i.__=n,i.u=r,J.__H.__h.push(i))}function kr(n,r){var i=Mn(Wn++,4);!S.__s&&_i(i.__H,r)&&(i.__=n,i.u=r,J.__h.push(i))}function Z(n){return Qn=5,D(function(){return{current:n}},[])}function Ru(n,r,i){Qn=6,kr(function(){if(typeof n=="function"){var _=n(r());return function(){n(null),_&&typeof _=="function"&&_()}}if(n)return n.current=r(),function(){return n.current=null}},i==null?i:i.concat(n))}function D(n,r){var i=Mn(Wn++,7);return _i(i.__H,r)&&(i.__=n(),i.__H=r,i.__h=n),i.__}function T(n,r){return Qn=8,D(function(){return n},r)}function Tu(n){var r=J.context[n.__c],i=Mn(Wn++,9);return i.c=n,r?(i.__==null&&(i.__=!0,r.sub(J)),r.props.value):n.__}function Uu(n,r){S.useDebugValue&&S.useDebugValue(r?r(n):n)}function Hu(n){var r=Mn(Wn++,10),i=w();return r.__=n,J.componentDidCatch||(J.componentDidCatch=function(_,c){r.__&&r.__(_,c),i[1](_)}),[i[0],function(){i[1](void 0)}]}function Lu(){for(var n;n=k_.shift();){var r=n.__H;if(n.__P&&r)try{r.__h.some(vr),r.__h.some(er),r.__h=[]}catch(i){r.__h=[],S.__e(i,n.__v)}}}function Nu(n){var r,i=function(){clearTimeout(_),$_&&cancelAnimationFrame(r),setTimeout(n)},_=setTimeout(i,35);$_&&(r=requestAnimationFrame(i))}function vr(n){var r=J,i=n.__c;typeof i=="function"&&(n.__c=void 0,i()),J=r}function er(n){var r=J;n.__c=n.__(),J=r}function _i(n,r){return!n||n.length!==r.length||r.some(function(i,_){return i!==n[_]})}function j_(n,r){return typeof r=="function"?r(n):r}function Gu(n){var r=w_.get(this);return r||(r=new Map,w_.set(this,r)),(r=R_(this,r.get(n)||(r.set(n,r=function(i){for(var _,c,u=1,f="",o="",s=[0],$=function(p){u===1&&(p||(f=f.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?s.push(0,p,f):u===3&&(p||f)?(s.push(3,p,f),u=2):u===2&&f==="..."&&p?s.push(4,p,0):u===2&&f&&!p?s.push(5,0,!0,f):u>=5&&((f||!p&&u===5)&&(s.push(u,0,f,c),u=6),p&&(s.push(u,p,0,c),u=6)),f=""},b=0;b<i.length;b++){b&&(u===1&&$(),$(b));for(var g=0;g<i[b].length;g++)_=i[b][g],u===1?_==="<"?($(),s=[s],u=3):f+=_:u===4?f==="--"&&_===">"?(u=1,f=""):f=_+f[0]:o?_===o?o="":f+=_:_==='"'||_==="'"?o=_:_===">"?($(),u=1):u&&(_==="="?(u=5,c=f,f=""):_==="/"&&(u<5||i[b][g+1]===">")?($(),u===3&&(s=s[0]),u=s,(s=s[0]).push(2,0,u),u=0):_===" "||_==="\t"||_===`
`||_==="\r"?($(),u=2):f+=_),u===3&&f==="!--"&&(u=4,s=s[0])}return $(),s}(n)),r),arguments,[])).length>1?r:r[0]}var zr,E,t_,pu,kn,r_,y_,x_,Cr,xr,an,h_,mr,Jr,Er,v_,br,pr,Ku,Fr,Wn,J,Or,c_,Qn=0,k_,S,u_,f_,l_,o_,s_,g_,$_,R_=function(n,r,i,_){var c;r[0]=0;for(var u=1;u<r.length;u++){var f=r[u++],o=r[u]?(r[0]|=f?1:2,i[r[u++]]):r[++u];f===3?_[0]=o:f===4?_[1]=Object.assign(_[1]||{},o):f===5?(_[1]=_[1]||{})[r[++u]]=o:f===6?_[1][r[++u]]+=o+"":f?(c=n.apply(o,R_(n,o,i,["",null])),_.push(c),o[0]?r[0]|=2:(r[u-2]=0,r[u]=c)):_.push(o)}return _},w_,l;var m=Y(()=>{br={},pr=[],Ku=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,Fr=Array.isArray;zr=pr.slice,E={__e:function(n,r,i,_){for(var c,u,f;r=r.__;)if((c=r.__c)&&!c.__)try{if((u=c.constructor)&&u.getDerivedStateFromError!=null&&(c.setState(u.getDerivedStateFromError(n)),f=c.__d),c.componentDidCatch!=null&&(c.componentDidCatch(n,_||{}),f=c.__d),f)return c.__E=c}catch(o){n=o}throw n}},t_=0,pu=function(n){return n!=null&&n.constructor===void 0},nr.prototype.setState=function(n,r){var i;i=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=vn({},this.state),typeof n=="function"&&(n=n(vn({},i),this.props)),n&&vn(i,n),n!=null&&this.__v&&(r&&this._sb.push(r),dr(this))},nr.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),dr(this))},nr.prototype.render=Br,kn=[],y_=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,x_=function(n,r){return n.__v.__b-r.__v.__b},Kr.__r=0,Cr=Math.random().toString(8),xr="__d"+Cr,an="__a"+Cr,h_=/(PointerCapture)$|Capture$/i,mr=0,Jr=__(!1),Er=__(!0),v_=0;k_=[],S=E,u_=S.__b,f_=S.__r,l_=S.diffed,o_=S.__c,s_=S.unmount,g_=S.__;S.__b=function(n){J=null,u_&&u_(n)},S.__=function(n,r){n&&r.__k&&r.__k.__m&&(n.__m=r.__k.__m),g_&&g_(n,r)},S.__r=function(n){f_&&f_(n),Wn=0;var r=(J=n.__c).__H;r&&(Or===J?(r.__h=[],J.__h=[],r.__.some(function(i){i.__N&&(i.__=i.__N),i.u=i.__N=void 0})):(r.__h.some(vr),r.__h.some(er),r.__h=[],Wn=0)),Or=J},S.diffed=function(n){l_&&l_(n);var r=n.__c;r&&r.__H&&(r.__H.__h.length&&(k_.push(r)!==1&&c_===S.requestAnimationFrame||((c_=S.requestAnimationFrame)||Nu)(Lu)),r.__H.__.some(function(i){i.u&&(i.__H=i.u),i.u=void 0})),Or=J=null},S.__c=function(n,r){r.some(function(i){try{i.__h.some(vr),i.__h=i.__h.filter(function(_){return!_.__||er(_)})}catch(_){r.some(function(c){c.__h&&(c.__h=[])}),r=[],S.__e(_,i.__v)}}),o_&&o_(n,r)},S.unmount=function(n){s_&&s_(n);var r,i=n.__c;i&&i.__H&&(i.__H.__.some(function(_){try{vr(_)}catch(c){r=c}}),i.__H=void 0,r&&S.__e(r,i.__v))};$_=typeof requestAnimationFrame=="function";w_=new Map;l=Gu.bind(ni)});function T_({children:n,className:r=""}){let[i,_]=w(null);return P(()=>{if(typeof document>"u")return;let c=document.createElement("div");return c.className=r||"",document.body.appendChild(c),_(c),()=>{try{An(null,c)}finally{c.remove()}}},[]),P(()=>{if(!i)return;i.className=r||"";return},[r,i]),kr(()=>{if(!i)return;An(n,i);return},[n,i]),null}var U_=Y(()=>{m()});function ci(n,r){let i=String(n.label||"").localeCompare(String(r.label||""),void 0,{sensitivity:"base"});if(i!==0)return i;return String(n.id||"").localeCompare(String(r.id||""),void 0,{sensitivity:"base"})}function qn(n){let r=Tn.findIndex((i)=>i.id===n.id);if(r>=0)Tn[r]=n;else Tn.push(n);Tn.sort(ci)}function ro(n){let r=Tn.findIndex((i)=>i.id===n);if(r>=0)Tn.splice(r,1)}function H_(){return[...Tn]}function io(){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent("piclaw:settings-panes-changed"))}var Tn;var rr=Y(()=>{Tn=[]});function Wr(n){let r=typeof n==="string"?n.trim():"";return r?r:null}function L_(n={}){if(typeof window>"u")return;let r=Wr(n.section);try{if(window.__piclawSettingsOpenRequested=!0,r)window.__piclawSettingsRequestedSection=r;else delete window.__piclawSettingsRequestedSection}catch(i){console.debug("[settings-dialog-events] failed to record open request flags",i)}window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:r?{section:r}:void 0}))}function ui(){if(typeof window>"u")return null;return Wr(window.__piclawSettingsRequestedSection)}function N_(){if(typeof window>"u")return{open:!1,section:null};let n=Boolean(window.__piclawSettingsOpenRequested),r=ui();try{window.__piclawSettingsOpenRequested=!1,delete window.__piclawSettingsRequestedSection}catch(i){console.debug("[settings-dialog-events] failed to clear open request flags",i)}return{open:n,section:r}}function V_(n=typeof window<"u"?window:null){return n||null}function jr(){if(typeof performance<"u"&&typeof performance.now==="function")return performance.now();return Date.now()}function ur(n,r){return`${n}:${r}`}function P_(n){return`${n}-${Math.random().toString(36).slice(2,10)}-${Date.now().toString(36)}`}function X_(n,r){if(n.length<=r)return;n.splice(0,n.length-r)}function Un(n){if(!n||typeof n!=="object")return null;return{...n}}function Nn(n){if(!n)return null;return Hn.find((r)=>r.id===n)||null}function fi(n,r){if(typeof performance>"u"||typeof performance.mark!=="function")return;try{performance.mark(`piclaw:${n}:${r}`)}catch(i){console.debug("[app-perf] Ignoring performance.mark failure.",i,{traceId:n,phase:r})}}function Q_(n){if(typeof performance>"u"||typeof performance.clearMarks!=="function")return;try{performance.clearMarks(`piclaw:${n}:start`);let r=Nn(n);if(!r)return;for(let i of r.phases)performance.clearMarks(`piclaw:${n}:${i.phase}`)}catch(r){console.debug("[app-perf] Ignoring performance.clearMarks failure.",r,{traceId:n})}}function G_(n,r,i){let _=Ln.get(ur(n,r));if(_&&Nn(_)?.status==="active")cr(_,"cancelled","superseded",{replacementType:n,replacementChatJid:r});let c=P_(n),u={id:c,type:n,chatJid:r,startedAt:jr(),detail:Un(i),phases:[],status:"active"};return Hn.push(u),X_(Hn,100),Ln.set(ur(n,r),c),fi(c,"start"),c}function cr(n,r,i,_,c){let u=Nn(n);if(!u||u.status!=="active")return;if(i)u.phases.push({phase:i,at:jr(),detail:Un(_)}),fi(u.id,i);if(u.status=r,u.completedAt=jr(),u.durationMs=u.completedAt-u.startedAt,c!==void 0)u.error=c instanceof Error?c.message:String(c);let f=ur(u.type,u.chatJid);if(Ln.get(f)===u.id)Ln.delete(f);Q_(u.id)}function Pu(n=V_()){let r=n?.__PICLAW_PERF__;if(r)return r;if(n)n.__PICLAW_PERF__=Rr;return Rr}function Dn(n=V_()){return Pu(n)}function uo(n,r,i){return Dn().ensureTrace(n,r,i)}function fo(n,r){return Dn().getActiveTraceId(n,r)}function lo(n,r,i){Dn().markTrace(n,r,i)}function oo(n,r,i="settled",_){let c=Nn(n);if(!c||c.status!=="active")return!1;let u=new Set(c.phases.map((f)=>f.phase));if(!r.every((f)=>u.has(f)))return!1;return cr(n,"completed",i,_),!0}function so(n,r,i="failed",_){Dn().failTrace(n,r,i,_)}function go(n,r="cancelled",i){Dn().cancelTrace(n,r,i)}function li(n){return Dn().recordRequest(n)}var Hn,_r,Ln,Rr;var A_=Y(()=>{Hn=[],_r=[],Ln=new Map;Rr={startTrace(n,r,i){return G_(n,r,i)},ensureTrace(n,r,i){let _=Ln.get(ur(n,r));if(_&&Nn(_)?.status==="active")return _;return G_(n,r,i)},getActiveTraceId(n,r){let i=Ln.get(ur(n,r));return i&&Nn(i)?.status==="active"?i:null},markTrace(n,r,i){let _=Nn(n);if(!_||_.status!=="active")return;_.phases.push({phase:r,at:jr(),detail:Un(i)}),fi(_.id,r)},completeTrace(n,r="settled",i){cr(n,"completed",r,i)},failTrace(n,r,i="failed",_){cr(n,"failed",i,_,r)},cancelTrace(n,r="cancelled",i){cr(n,"cancelled",r,i)},recordRequest(n){let r=P_("req");return _r.push({...n,id:r,detail:Un(n.detail)}),X_(_r,300),r},getTraces(){return Hn.map((n)=>({...n,detail:Un(n.detail),phases:n.phases.map((r)=>({...r,detail:Un(r.detail)}))}))},getRequests(){return _r.map((n)=>({...n,detail:Un(n.detail)}))},clear(){Hn.forEach((n)=>Q_(n.id)),Hn.splice(0,Hn.length),_r.splice(0,_r.length),Ln.clear()},printSummary(){let n={traces:Rr.getTraces(),requests:Rr.getRequests()};return console.table(n.traces.map((r)=>({id:r.id,type:r.type,chatJid:r.chatJid,status:r.status,durationMs:Number(r.durationMs||0).toFixed(1),lastPhase:r.phases[r.phases.length-1]?.phase||"start"}))),n}}});function Zn(n){let r=Number(n||0);return Number.isFinite(r)&&r>0?r:null}function Xu(n){try{return Boolean(n?.matchMedia?.("(pointer: coarse)")?.matches)}catch{return!1}}function Qu(n){let r=String(n?.navigator?.userAgent||"");return/Android|webOS|iPhone|iPod|Mobile|Windows Phone/i.test(r)}function M_(n){let r=String(n?.navigator?.userAgent||"");return/iPad|Tablet|PlayBook|Silk/i.test(r)}function q_(n=typeof window<"u"?window:null){let r=Zn(n?.innerWidth)??Zn(n?.screen?.availWidth)??Zn(n?.screen?.width)??0,i=Zn(n?.innerHeight)??Zn(n?.screen?.availHeight)??Zn(n?.screen?.height)??0,_=r&&i?Math.min(r,i):r||i,c=r&&i?Math.max(r,i):r||i,u=Xu(n),f=Number(n?.navigator?.maxTouchPoints||0),o=u||f>1;if(_>0&&_<=640)return"mobile";if(Qu(n)&&!M_(n))return"mobile";if(M_(n))return"tablet";if(o&&_>0&&_<=1100)return"tablet";if(c>0&&c<=1180&&_>0&&_<=900)return"tablet";return"desktop"}var af={};_n(af,{uploadWorkspaceFile:()=>Yf,uploadMedia:()=>pf,updateWorkspaceFile:()=>Qf,updateScheduledTask:()=>$i,submitAdaptiveCardAction:()=>zf,streamSidePrompt:()=>Ff,stopSessionRecording:()=>yi,stopAutoresearch:()=>wf,steerAgentQueueItem:()=>hf,startSessionRecording:()=>ti,setWorkspaceVisibility:()=>df,setAgentThoughtVisibility:()=>Wf,sessionRecordingPlaybackUrl:()=>hi,sessionRecordingExportUrl:()=>fr,sendPeerAgentMessage:()=>cf,sendAgentMessage:()=>pn,searchPosts:()=>Du,saveWorkspaceSettings:()=>Fi,saveWebPushSubscription:()=>ff,saveUiState:()=>bi,saveQuickActionsSettings:()=>zi,savePostAnnotations:()=>mf,saveEnvironmentOverride:()=>Ur,restoreChatBranch:()=>_f,respondToAgentRequest:()=>Kf,reorderAgentQueueItem:()=>vf,renameWorkspaceFile:()=>Of,renameChatJid:()=>rf,renameChatBranch:()=>eu,removeAgentQueueItem:()=>xf,reindexWorkspace:()=>Vf,purgeChatBranch:()=>nf,pruneChatBranch:()=>au,previewSessionRecordingRedaction:()=>vi,moveWorkspaceEntry:()=>Jf,mergeChatBranchIntoParent:()=>mu,getWorkspaceTree:()=>Lf,getWorkspaceRawUrl:()=>Z_,getWorkspaceIndexStatus:()=>Gf,getWorkspaceFileStat:()=>Xf,getWorkspaceFileDownloadUrl:()=>Sf,getWorkspaceFile:()=>Pf,getWorkspaceDownloadUrl:()=>ef,getWorkspaceBranch:()=>Nf,getWebPushPublicKey:()=>uf,getTimeline:()=>Mu,getThumbnailUrl:()=>Rf,getThread:()=>Zu,getSystemMetrics:()=>Iu,getSessionRecordings:()=>wi,getSessionRecording:()=>Tr,getScheduledTasks:()=>gi,getQuickActionsSettings:()=>Ki,getPostsByHashtag:()=>qu,getMediaUrl:()=>jf,getMediaText:()=>Uf,getMediaInfo:()=>Tf,getMediaBlob:()=>Hf,getEnvironmentSettings:()=>Bi,getChatBranches:()=>Eu,getAutoresearchStatus:()=>$f,getAgents:()=>of,getAgentThought:()=>kf,getAgentStatus:()=>sf,getAgentQueueState:()=>yf,getAgentModels:()=>ki,getAgentContext:()=>gf,getAgentCommands:()=>pi,getActiveChatAgents:()=>Ju,forkChatBranch:()=>du,dismissAutoresearch:()=>tf,deleteWorkspaceFile:()=>Ef,deleteWebPushSubscription:()=>lf,deleteSessionRecording:()=>xi,deletePost:()=>Ou,createWorkspaceFile:()=>Cf,createRootChatSession:()=>Su,createReply:()=>Cu,createPost:()=>Yu,completeInstanceOobe:()=>bf,attachWorkspaceFile:()=>Af,addToWhitelist:()=>Bf,SSEClient:()=>I_});function bn(n,r={}){if(String(r.method||"GET").toUpperCase()!=="GET")return A(n,r);let _=oi.get(n);if(_)return _;let c=A(n,r).finally(()=>{oi.delete(n)});return oi.set(n,c),c}async function A(n,r={}){let i=typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now(),_;try{_=await fetch(nn+n,{...r,headers:{"Content-Type":"application/json",...r.headers}})}catch(u){throw li({method:String(r.method||"GET").toUpperCase(),url:n,startedAt:i,durationMs:(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-i,ok:!1,detail:{failedBeforeResponse:!0}}),u}let c=(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-i;if(li({method:String(r.method||"GET").toUpperCase(),url:n,startedAt:i,durationMs:c,status:_.status,ok:_.ok,requestId:_.headers?.get?.("x-request-id")||null,serverTiming:_.headers?.get?.("Server-Timing")||null}),!_.ok){let u=await _.json().catch(()=>({error:"Unknown error"}));throw Error(u.error||`HTTP ${_.status}`)}return _.json()}function D_(n){let r=String(n||"").split(`
`),i="message",_=[];for(let u of r)if(u.startsWith("event:"))i=u.slice(6).trim()||"message";else if(u.startsWith("data:"))_.push(u.slice(5).trim());let c=_.join(`
`);if(!c)return null;try{return{event:i,data:JSON.parse(c)}}catch{return{event:i,data:c}}}async function Au(n,r){if(!n.body)throw Error("Missing event stream body");let i=n.body.getReader(),_=new TextDecoder,c="";while(!0){let{value:f,done:o}=await i.read();if(o)break;c+=_.decode(f,{stream:!0});let s=c.split(`

`);c=s.pop()||"";for(let $ of s){let b=D_($);if(b)r(b.event,b.data)}}c+=_.decode();let u=D_(c);if(u)r(u.event,u.data)}async function Mu(n=10,r=null,i=null){let _=`/timeline?limit=${n}`;if(r)_+=`&before=${r}`;if(i)_+=`&chat_jid=${encodeURIComponent(i)}`;return bn(_)}async function qu(n,r=50,i=0,_=null){let c=_?`&chat_jid=${encodeURIComponent(_)}`:"";return A(`/hashtag/${encodeURIComponent(n)}?limit=${r}&offset=${i}${c}`)}async function Du(n,r=50,i=0,_=null,c="current",u=null,f=null){let o=_?`&chat_jid=${encodeURIComponent(_)}`:"",s=c?`&scope=${encodeURIComponent(c)}`:"",$=u?`&root_chat_jid=${encodeURIComponent(u)}`:"",b=f?.images?"&images=1":"",g=f?.attachments?"&attachments=1":"";return A(`/search?q=${encodeURIComponent(n)}&limit=${r}&offset=${i}${o}${s}${$}${b}${g}`)}async function Zu(n,r=null){let i=r?`?chat_jid=${encodeURIComponent(r)}`:"";return A(`/thread/${n}${i}`)}async function Iu(){return A("/agent/system-metrics")}async function gi(n={}){let r=new URLSearchParams;if(n?.id)r.set("id",String(n.id));if(n?.chatJid)r.set("chat_jid",String(n.chatJid));if(n?.status&&n.status!=="all")r.set("status",String(n.status));if(n?.limit)r.set("limit",String(n.limit));if(n?.includeRunLogs)r.set("include_run_logs","1");if(n?.runLogLimit)r.set("run_log_limit",String(n.runLogLimit));let i=r.toString()?`?${r.toString()}`:"";return A(`/agent/scheduled-tasks${i}`)}async function $i(n,r,i={}){return A("/agent/scheduled-tasks/action",{method:"POST",body:JSON.stringify({action:n,id:r,allow_internal:i?.allowInternal===!0})})}async function wi(){return A("/agent/recordings")}async function Tr(n){return A(`/agent/recordings/${encodeURIComponent(n)}`)}async function ti(n={}){return A("/agent/recordings/start",{method:"POST",body:JSON.stringify(n||{})})}async function yi(n={}){return A("/agent/recordings/stop",{method:"POST",body:JSON.stringify(n||{})})}async function xi(n){return A(`/agent/recordings/${encodeURIComponent(n)}`,{method:"DELETE"})}function fr(n,r="json"){return`/agent/recordings/${encodeURIComponent(n)}/export?format=${encodeURIComponent(r)}`}function hi(n){return`/recordings/playback?id=${encodeURIComponent(n)}`}async function vi(n,r={}){return A("/agent/recordings/redact-preview",{method:"POST",body:JSON.stringify({payload:n,...r})})}async function bi(n){return A("/agent/ui-state",{method:"POST",body:JSON.stringify(n||{})})}async function Yu(n,r=[],i=null){let _=i?`?chat_jid=${encodeURIComponent(i)}`:"";return A(`/post${_}`,{method:"POST",body:JSON.stringify({content:n,media_ids:r})})}async function Cu(n,r,i=[],_=null){let c=_?`?chat_jid=${encodeURIComponent(_)}`:"";return A(`/post/reply${c}`,{method:"POST",body:JSON.stringify({thread_id:n,content:r,media_ids:i})})}async function Ou(n,r=!1,i=null){let _=i?`&chat_jid=${encodeURIComponent(i)}`:"",c=`/post/${n}?cascade=${r?"true":"false"}${_}`;return A(c,{method:"DELETE"})}async function pn(n,r,i=null,_=[],c=null,u=null){let f=u?`?chat_jid=${encodeURIComponent(u)}`:"",o={content:r,thread_id:i,media_ids:_,client_context:{screen_hint:q_()}};if(c==="auto"||c==="queue"||c==="steer")o.mode=c;return A(`/agent/${n}/message${f}`,{method:"POST",body:JSON.stringify(o)})}async function pi(n="web:default"){let r=typeof n==="string"&&n.trim()?n.trim():"web:default";return bn(`/agent/commands?chat_jid=${encodeURIComponent(r)}`)}async function Ki(){return A("/agent/settings/quick-actions")}async function zi(n){return A("/agent/settings/quick-actions",{method:"POST",body:JSON.stringify(n||{})})}async function Fi(n){return A("/agent/settings/workspace",{method:"POST",body:JSON.stringify(n||{})})}async function Bi(){return A("/agent/settings/environment")}async function Ur(n){return A("/agent/settings/environment",{method:"POST",body:JSON.stringify(n||{})})}async function Ju(){return A("/agent/active-chats")}async function Eu(n=null,r={}){let i=new URLSearchParams;if(n)i.set("root_chat_jid",String(n));if(r?.includeArchived)i.set("include_archived","1");let _=i.toString()?`?${i.toString()}`:"";return bn(`/agent/branches${_}`)}async function du(n,r={}){return A("/agent/branch-fork",{method:"POST",body:JSON.stringify({source_chat_jid:n,...r?.agentName?{agent_name:r.agentName}:{}})})}async function Su(n){return A("/agent/root-session",{method:"POST",body:JSON.stringify({agent_name:n})})}async function eu(n,r={}){return A("/agent/branch-rename",{method:"POST",body:JSON.stringify({chat_jid:n,...r&&Object.prototype.hasOwnProperty.call(r,"agentName")?{agent_name:r.agentName}:{}})})}async function mu(n){return A("/agent/branch-merge-parent",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function au(n){return A("/agent/branch-prune",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function nf(n){return A("/agent/branch-purge",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function rf(n,r){return A("/agent/rename-jid",{method:"POST",body:JSON.stringify({old_jid:n,new_jid:r})})}async function _f(n,r={}){return A("/agent/branch-restore",{method:"POST",body:JSON.stringify({chat_jid:n,...r&&Object.prototype.hasOwnProperty.call(r,"agentName")?{agent_name:r.agentName}:{}})})}async function cf(n,r,i,_="auto",c={}){let u={source_chat_jid:n,content:i,mode:_,...c?.sourceAgentName?{source_agent_name:c.sourceAgentName}:{},...c?.targetBy==="agent_name"?{target_agent_name:r}:{target_chat_jid:r}};return A("/agent/peer-message",{method:"POST",body:JSON.stringify(u)})}async function uf(){return A("/agent/push/vapid-public-key")}async function ff(n,r={}){let i={subscription:n,...r?.deviceId?{device_id:r.deviceId}:{}};return A("/agent/push/subscription",{method:"POST",body:JSON.stringify(i)})}async function lf(n,r={}){let i={subscription:n,...r?.deviceId?{device_id:r.deviceId}:{}};return A("/agent/push/subscription",{method:"DELETE",body:JSON.stringify(i)})}async function of(){return bn("/agent/roster")}async function sf(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return bn(`/agent/status${r}`)}async function gf(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return bn(`/agent/context${r}`)}async function $f(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return bn(`/agent/autoresearch/status${r}`)}async function wf(n=null,r={}){return A("/agent/autoresearch/stop",{method:"POST",body:JSON.stringify({chat_jid:n||void 0,generate_report:r?.generateReport!==!1})})}async function tf(n=null){return A("/agent/autoresearch/dismiss",{method:"POST",body:JSON.stringify({chat_jid:n||void 0})})}async function yf(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return bn(`/agent/queue-state${r}`)}async function xf(n,r=null){let i=await fetch(nn+"/agent/queue-remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:n,chat_jid:r||void 0})});if(!i.ok){let _=await i.json().catch(()=>({error:"Failed to remove queued item"}));throw Error(_.error||`HTTP ${i.status}`)}return i.json()}async function hf(n,r=null){let i=await fetch(nn+"/agent/queue-steer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:n,chat_jid:r||void 0})});if(!i.ok){let _=await i.json().catch(()=>({error:"Failed to steer queued item"}));throw Error(_.error||`HTTP ${i.status}`)}return i.json()}async function vf(n,r,i=null){let _=await fetch(nn+"/agent/queue-reorder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from_index:n,to_index:r,chat_jid:i||void 0})});if(!_.ok){let c=await _.json().catch(()=>({error:"Failed to reorder queued item"}));throw Error(c.error||`HTTP ${_.status}`)}return _.json()}async function ki(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return bn(`/agent/models${r}`)}async function bf(n="provider-ready"){return A("/agent/oobe/complete",{method:"POST",body:JSON.stringify({kind:n})})}async function pf(n){let r=new FormData;r.append("file",n);let i=await fetch(nn+"/media/upload",{method:"POST",body:r});if(!i.ok){let _=await i.json().catch(()=>({error:"Upload failed"}));throw Error(_.error||`HTTP ${i.status}`)}return i.json()}async function Kf(n,r,i=null){let _=await fetch(nn+"/agent/respond",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id:n,outcome:r,chat_jid:i||void 0})});if(!_.ok){let c=await _.json().catch(()=>({error:"Failed to respond"}));throw Error(c.error||`HTTP ${_.status}`)}return _.json()}async function zf(n){let r=await fetch(nn+"/agent/card-action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!r.ok){let i=await r.json().catch(()=>({error:"Adaptive Card action failed"}));throw Error(i.error||`HTTP ${r.status}`)}return r.json()}async function Ff(n,r={}){let i=await fetch(nn+"/agent/side-prompt/stream",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:n,system_prompt:r.systemPrompt||void 0,chat_jid:r.chatJid||void 0}),signal:r.signal});if(!i.ok){let u=await i.json().catch(()=>({error:"Side prompt failed"}));throw Error(u.error||`HTTP ${i.status}`)}let _=null,c=null;if(await Au(i,(u,f)=>{if(r.onEvent?.(u,f),u==="side_prompt_thinking_delta")r.onThinkingDelta?.(f?.delta||"");else if(u==="side_prompt_text_delta")r.onTextDelta?.(f?.delta||"");else if(u==="side_prompt_done")_=f;else if(u==="side_prompt_error")c=f}),c){let u=Error(c?.error||"Side prompt failed");throw u.payload=c,u}return _}async function Bf(n,r){let i=await fetch(nn+"/agent/whitelist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pattern:n,description:r})});if(!i.ok){let _=await i.json().catch(()=>({error:"Failed to add to whitelist"}));throw Error(_.error||`HTTP ${i.status}`)}return i.json()}async function kf(n,r="thought"){let i=`/agent/thought?turn_id=${encodeURIComponent(n)}&panel=${encodeURIComponent(r)}`;return A(i)}async function Wf(n,r,i){return A("/agent/thought/visibility",{method:"POST",body:JSON.stringify({turn_id:n,panel:r,expanded:Boolean(i)})})}function jf(n){return`${nn}/media/${n}`}function Rf(n){return`${nn}/media/${n}/thumbnail`}async function Tf(n){let r=await fetch(`${nn}/media/${n}/info`);if(!r.ok)throw Error("Failed to get media info");return r.json()}async function Uf(n){let r=await fetch(`${nn}/media/${n}`);if(!r.ok)throw Error("Failed to load media text");return r.text()}async function Hf(n){let r=await fetch(`${nn}/media/${n}`);if(!r.ok)throw Error("Failed to load media blob");return r.blob()}async function Lf(n="",r=2,i=!1){let _=`/workspace/tree?path=${encodeURIComponent(n)}&depth=${r}&show_hidden=${i?"1":"0"}`;return A(_)}async function Nf(n=""){let r=`/workspace/branch?path=${encodeURIComponent(n||"")}`;return A(r)}async function Gf(n="all"){let r=`/workspace/index-status?scope=${encodeURIComponent(n||"all")}`;return A(r)}async function Vf(n="all"){return A("/workspace/reindex",{method:"POST",body:JSON.stringify({scope:n})})}async function Pf(n,r=20000,i=null){let _=i?`&mode=${encodeURIComponent(i)}`:"",c=`/workspace/file?path=${encodeURIComponent(n)}&max=${r}${_}`;return A(c)}async function Xf(n){return A(`/workspace/stat?path=${encodeURIComponent(n)}`)}async function Qf(n,r){return A("/workspace/file",{method:"PUT",body:JSON.stringify({path:n,content:r})})}async function Af(n){return A("/workspace/attach",{method:"POST",body:JSON.stringify({path:n})})}function qf(n,r="",i={}){let _=new URLSearchParams;if(r)_.set("path",r);if(i.overwrite)_.set("overwrite","1");let c=_.toString();return c?`${n}?${c}`:n}function Df(){if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();return`upload-${Date.now()}-${Math.random().toString(36).slice(2)}`}function Zf(n,r,i,_){return new Promise((c,u)=>{let f=new XMLHttpRequest;f.open("POST",nn+r);for(let[o,s]of Object.entries(i||{}))if(s!==void 0&&s!==null)f.setRequestHeader(o,String(s));f.upload.onprogress=(o)=>{if(typeof _==="function")_({loaded:o.lengthComputable?o.loaded:0,total:o.lengthComputable?o.total:n.size,lengthComputable:o.lengthComputable})},f.onload=()=>{try{let o=f.responseText?JSON.parse(f.responseText):{};if(f.status>=200&&f.status<300)c(o);else{let s=Error(o.error||`HTTP ${f.status}`);s.status=f.status,s.code=o.code,u(s)}}catch{let o=Error(`HTTP ${f.status}`);o.status=f.status,u(o)}},f.onerror=()=>u(Error("Upload failed (network error)")),f.ontimeout=()=>u(Error("Upload timed out")),f.send(n)})}async function If(n,r="",i={}){let _=Df(),c=qf("/workspace/upload-chunk",r,i),u=Math.max(1,Math.min(si,Number(i.chunkSize)||Mf)),f=Math.max(0,Number(n?.size)||0),o=Math.max(1,Math.ceil(f/u)),s=0,$=null;for(let b=0;b<o;b+=1){let g=b*u,p=Math.min(f,g+u),h=n.slice(g,p),v=h.size;if($=await Zf(h,c,{"X-Upload-Id":_,"X-Chunk-Index":b,"X-Chunk-Total":o,"X-File-Name":n?.name||"upload.bin","X-File-Size":f},(F)=>{if(typeof i.onProgress!=="function")return;let y=Math.min(f,s+(F?.loaded||0)),K=f||1;i.onProgress({loaded:y,total:K,percent:Math.round(y/K*100),chunkIndex:b,chunkTotal:o})}),s+=v,typeof i.onProgress==="function"){let F=f||1,y=f?s:F;i.onProgress({loaded:y,total:F,percent:Math.round(y/F*100),chunkIndex:b+1,chunkTotal:o})}}return $}async function Yf(n,r="",i={}){if(n?.size>si){let _=(n.size/1048576).toFixed(0),c=(si/1048576).toFixed(0),u=Error(`File too large (${_} MB). Maximum upload size is ${c} MB.`);throw u.code="file_too_large",u}return await If(n,r,i)}async function Cf(n,r,i=""){let _=await fetch(nn+"/workspace/file",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,name:r,content:i})});if(!_.ok){let c=await _.json().catch(()=>({error:"Create failed"})),u=Error(c.error||`HTTP ${_.status}`);throw u.status=_.status,u.code=c.code,u}return _.json()}async function Of(n,r){let i=await fetch(nn+"/workspace/rename",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,name:r})});if(!i.ok){let _=await i.json().catch(()=>({error:"Rename failed"})),c=Error(_.error||`HTTP ${i.status}`);throw c.status=i.status,c.code=_.code,c}return i.json()}async function Jf(n,r){let i=await fetch(nn+"/workspace/move",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,target:r})});if(!i.ok){let _=await i.json().catch(()=>({error:"Move failed"})),c=Error(_.error||`HTTP ${i.status}`);throw c.status=i.status,c.code=_.code,c}return i.json()}async function Ef(n){let r=`/workspace/file?path=${encodeURIComponent(n||"")}`;return A(r,{method:"DELETE"})}async function df(n,r=!1){return A("/workspace/visibility",{method:"POST",body:JSON.stringify({visible:Boolean(n),show_hidden:Boolean(r)})})}function Z_(n,r={}){let i=new URLSearchParams({path:String(n||"")});if(r.download)i.set("download","1");return`${nn}/workspace/raw?${i.toString()}`}function Sf(n){return Z_(n,{download:!0})}function ef(n,r=!1){let i=`path=${encodeURIComponent(n||"")}&show_hidden=${r?"1":"0"}`;return`${nn}/workspace/download?${i}`}class I_{onEvent;onStatusChange;chatJid;eventSource;reconnectTimeout;reconnectDelay;status;reconnectAttempts;cooldownUntil;connecting;lastActivityAt;staleCheckTimer;staleThresholdMs;constructor(n,r,i={}){this.onEvent=n,this.onStatusChange=r,this.chatJid=typeof i?.chatJid==="string"&&i.chatJid.trim()?i.chatJid.trim():null,this.eventSource=null,this.reconnectTimeout=null,this.reconnectDelay=1000,this.status="disconnected",this.reconnectAttempts=0,this.cooldownUntil=0,this.connecting=!1,this.lastActivityAt=0,this.staleCheckTimer=null,this.staleThresholdMs=70000}markActivity(){this.lastActivityAt=Date.now()}clearStaleMonitor(){if(this.staleCheckTimer)clearInterval(this.staleCheckTimer),this.staleCheckTimer=null}startStaleMonitor(){this.clearStaleMonitor(),this.staleCheckTimer=setInterval(()=>{if(this.status!=="connected")return;if(!this.lastActivityAt)return;if(Date.now()-this.lastActivityAt<=this.staleThresholdMs)return;console.warn("SSE connection went stale; forcing reconnect"),this.forceReconnect()},15000)}forceReconnect(){if(this.connecting=!1,this.eventSource)this.eventSource.close(),this.eventSource=null;this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()}connect(){if(this.connecting)return;if(this.eventSource&&this.status==="connected")return;if(this.connecting=!0,this.eventSource)this.eventSource.close();this.clearStaleMonitor();let n=this.chatJid?`?chat_jid=${encodeURIComponent(this.chatJid)}`:"";this.eventSource=new EventSource(nn+"/sse/stream"+n);let r=(i)=>{this.eventSource.addEventListener(i,(_)=>{this.markActivity(),this.onEvent(i,JSON.parse(_.data))})};this.eventSource.onopen=()=>{this.connecting=!1,this.reconnectDelay=1000,this.reconnectAttempts=0,this.cooldownUntil=0,this.status="connected",this.markActivity(),this.startStaleMonitor(),this.onStatusChange("connected")},this.eventSource.onerror=()=>{this.connecting=!1,this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()},this.eventSource.addEventListener("connected",()=>{this.markActivity(),console.log("SSE connected"),this.onEvent("connected",{})}),this.eventSource.addEventListener("heartbeat",()=>{this.markActivity()}),r("new_post"),r("new_reply"),r("agent_response"),r("interaction_updated"),r("interaction_deleted"),r("agent_status"),r("agent_steer_queued"),r("agent_followup_queued"),r("agent_followup_consumed"),r("agent_followup_removed"),r("workspace_update"),r("agent_draft"),r("agent_draft_delta"),r("agent_thought"),r("agent_thought_delta"),r("model_changed"),r("ui_theme"),r("ui_meters"),["extension_ui_request","extension_ui_timeout","extension_ui_notify","extension_ui_status","extension_ui_working","extension_ui_working_indicator","extension_ui_working_visible","extension_ui_widget","extension_ui_title","extension_ui_editor_text","extension_ui_error"].forEach(r)}scheduleReconnect(){if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout);let n=10,r=60000,i=Date.now();if(this.reconnectAttempts>=n)this.cooldownUntil=Math.max(this.cooldownUntil,i+r),this.reconnectAttempts=0;let _=Math.max(this.cooldownUntil-i,0),c=Math.max(this.reconnectDelay,_);this.reconnectTimeout=setTimeout(()=>{console.log("Reconnecting SSE..."),this.connect()},c),this.reconnectDelay=Math.min(this.reconnectDelay*2,30000)}reconnectIfNeeded(){let n=Date.now();if(this.status==="connected"){if(this.lastActivityAt&&n-this.lastActivityAt>this.staleThresholdMs)this.forceReconnect();return}if(this.cooldownUntil&&n<this.cooldownUntil)return;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null;this.connect()}disconnect(){if(this.connecting=!1,this.clearStaleMonitor(),this.eventSource)this.eventSource.close(),this.eventSource=null;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null}}async function mf(n,r,i){let _=i?`?chat_jid=${encodeURIComponent(i)}`:"";return A(`/post/${n}/annotations${_}`,{method:"PATCH",body:JSON.stringify({annotations:r})})}var nn="",oi,si=1073741824,Mf=8388608;var Kn=Y(()=>{A_();oi=new Map});function In(n){if(typeof window>"u"||!window.localStorage)return null;try{return window.localStorage.getItem(n)}catch{return null}}function fn(n,r){if(typeof window>"u"||!window.localStorage)return;try{window.localStorage.setItem(n,r)}catch{return}}function Wi(n,r=!1){let i=In(n);if(i===null)return r;return i==="true"}function ji(n,r=null){let i=In(n);if(i===null)return r;let _=parseInt(i,10);return Number.isFinite(_)?_:r}function Y_(n){let r=In(n);if(!r)return null;try{return JSON.parse(r)}catch{return null}}function rl(n){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(Lr,{detail:{enabled:Boolean(n)}}))}function J_(n){if(typeof fetch!=="function")return;bi({ui_meters:n}).catch((r)=>{console.debug("[meters] Failed to persist meters UI state.",r)})}function il(n){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(nl,{detail:{collapsed:Boolean(n)}}))}function Ri(n=!1){return Wi(C_,n)}function bo(n=!1){return Wi(O_,n)}function Hr(n,r={}){let i=r.persist!==!1,_=r.persistServer!==!1,c=Boolean(n);if(i)fn(C_,c?"true":"false");if(_)J_({enabled:c});return rl(c),c}function _l(n,r={}){let i=r.persist!==!1,_=r.persistServer!==!1,c=Boolean(n);if(i)fn(O_,c?"true":"false");if(_)J_({collapsed:c});return il(c),c}function po(n){let r=typeof n?.mode==="string"?n.mode.trim().toLowerCase():"";if(typeof n?.enabled==="boolean")Hr(Boolean(n.enabled),{persistServer:!1});else if(r==="toggle"){let i=!Ri(!1);Hr(i,{persistServer:!1})}if(typeof n?.collapsed==="boolean")_l(Boolean(n.collapsed),{persistServer:!1})}var C_="piclaw_system_meters_enabled",O_="piclaw_system_meters_collapsed",Lr="piclaw-meters-change",nl="piclaw-meters-collapsed-change";var E_=Y(()=>{Kn()});function d_(n,r){if(n===""||n===null||n===void 0)return r;let i=Number(n);return Number.isFinite(i)?i:r}function S_(n,{min:r=-1/0,max:i=1/0}={}){let _=Number.isFinite(Number(r))?Number(r):-1/0,c=Number.isFinite(Number(i))?Number(i):1/0;return Math.min(c,Math.max(_,Number(n)))}function Yn(n,{fallback:r=0,min:i=-1/0,max:_=1/0}={}){let c=d_(n,r);return S_(c,{min:i,max:_})}function cl(n,{direction:r=1,step:i=1,fallback:_=0,min:c=-1/0,max:u=1/0}={}){let f=Yn(n,{fallback:_,min:c,max:u}),o=Math.abs(d_(i,1))||1,s=Number(r)<0?-1:1;return S_(f+s*o,{min:c,max:u})}function e({value:n,min:r,max:i,step:_=1,fallback:c,width:u="80px",disabled:f=!1,label:o,onChange:s}){let $=Number.isFinite(Number(c))?Number(c):Yn(n,{fallback:0,min:r,max:i}),[b,g]=w(String(n??$)),p=Z(!1);P(()=>{if(!p.current)g(String(n??$))},[n,$]);let h=T((F)=>{p.current=!1;let y=Yn(F,{fallback:$,min:r,max:i});g(String(y)),s?.(y)},[$,r,i,s]),v=T((F)=>{p.current=!1;let y=cl(n,{direction:F,step:_,fallback:$,min:r,max:i});g(String(y)),s?.(y)},[$,i,r,s,_,n]);return l`
        <span class="settings-number-stepper">
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Decrease ${o||"value"}`}
                title=${`Decrease ${o||"value"}`}
                disabled=${f}
                onClick=${()=>v(-1)}
            >−</button>
            <input
                class="settings-number-input"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                value=${b}
                disabled=${f}
                style=${`width:${u}`}
                onInput=${(F)=>{p.current=!0,g(F.target.value)}}
                onBlur=${(F)=>h(F.target.value)}
                onKeyDown=${(F)=>{if(F.key==="Enter")F.preventDefault(),h(F.target.value),F.target.blur()}}
            />
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Increase ${o||"value"}`}
                title=${`Increase ${o||"value"}`}
                disabled=${f}
                onClick=${()=>v(1)}
            >+</button>
        </span>
    `}var Cn=Y(()=>{m()});function e_(n){let r=String(n||"").trim();if(!r)return"";if(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("data:")||r.startsWith("blob:"))return r;if(r.startsWith("/workspace/"))return`/workspace/file?path=${encodeURIComponent(r.slice(11))}`;if(r.startsWith("/"))return"";if(/^[a-zA-Z]:[\\/]/.test(r))return"";if(r.startsWith("\\\\"))return"";if(r.includes("\\"))return"";return`/workspace/file?path=${encodeURIComponent(r.replace(/^\.\//,""))}`}function m_({value:n,onChange:r}){let i=Z(null),[_,c]=w(e_(n));P(()=>{c(e_(n))},[n]);let u=T((f)=>{let o=f.target.files?.[0];if(!o)return;let s=new FileReader;s.onload=()=>{let $=s.result;c($),r?.($)},s.readAsDataURL(o)},[r]);return l`
        <div class="settings-avatar-inline" onClick=${()=>i.current?.click()} title="Click to upload">
            ${_?l`<img src=${_} alt="avatar" />`:l`<span class="settings-avatar-placeholder">+</span>`}
            <input type="file" accept="image/*" ref=${i} style="display:none" onChange=${u} />
        </div>
    `}function a_(n={}){return{userName:n.userName||"",userAvatar:n.userAvatar||"",assistantName:n.assistantName||"",assistantAvatar:n.assistantAvatar||"",composeUploadLimitMb:n.composeUploadLimitMb??32,workspaceUploadLimitMb:n.workspaceUploadLimitMb??256}}async function ul(n,r={}){let i=typeof n==="string"?n:"";if(!i)return!1;let _=r.navigator??(typeof navigator<"u"?navigator:null),c=r.document??(typeof document<"u"?document:null);if(_?.clipboard?.writeText)try{return await _.clipboard.writeText(i),!0}catch(u){}try{if(!c?.body||typeof c.createElement!=="function"||typeof c.execCommand!=="function")return!1;let u=c.createElement("textarea");u.value=i,u.setAttribute?.("readonly",""),u.style.position="fixed",u.style.left="-9999px",u.style.top="0",u.style.opacity="0",c.body.appendChild(u),u.focus?.(),u.select?.();let f=Boolean(c.execCommand("copy"));return c.body.removeChild(u),f}catch(u){return!1}}function Ti({settingsData:n,setStatus:r,mergeSettingsData:i}){let[_,c]=w(""),[u,f]=w(""),[o,s]=w(""),[$,b]=w(""),[g,p]=w(32),[h,v]=w(256),[F,y]=w(""),[K,W]=w(!1),[N,B]=w(!1),[U,z]=w(!1),[j,X]=w(()=>Ri(!1)),[t,H]=w(!1),k=Z(""),x=Z(null),L=Z(!0);P(()=>{return L.current=!0,()=>{L.current=!1}},[]);let Q=T((I)=>{let V=a_(I);c(V.userName),f(V.userAvatar),s(V.assistantName),b(V.assistantAvatar),p(V.composeUploadLimitMb),v(V.workspaceUploadLimitMb),y(I?.widgetToken||""),k.current=JSON.stringify(V)},[]);P(()=>{Q(n||{})},[n,Q]),P(()=>{let I=(V)=>{X(Boolean(V?.detail?.enabled))};return window.addEventListener(Lr,I),()=>window.removeEventListener(Lr,I)},[]);let C=D(()=>JSON.stringify(a_({userName:_,userAvatar:u,assistantName:o,assistantAvatar:$,composeUploadLimitMb:g,workspaceUploadLimitMb:h})),[_,u,o,$,g,h]);P(()=>{if(C===k.current)return;if(x.current)clearTimeout(x.current);return x.current=setTimeout(async()=>{if(!L.current)return;let I=document.activeElement;if(I&&I.closest?.(".settings-number-stepper"))return;try{let V=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:C}),q=await V.json().catch(()=>({}));if(!L.current)return;if(!V.ok||!q?.ok||!q?.settings)return;k.current=C,i?.(q.settings),H(!0),setTimeout(()=>{if(L.current)H(!1)},4000)}catch(V){console.warn("[settings/general] Failed to persist general settings snapshot.",V)}},800),()=>{if(x.current)clearTimeout(x.current)}},[C,i]);let O=n?.instanceTotp||{configured:!1,issuer:o||"Piclaw",label:_?`${o||"Piclaw"}:${_}`:o||"Piclaw",secret:"",otpauth:"",qrSvg:""},gn=T(async()=>{if(!F)return;if(await ul(F))B(!0),setTimeout(()=>{if(L.current)B(!1)},3000);else r?.("Could not copy widget token. Select the token field and copy manually."),console.warn("[settings/general] Failed to copy widget token. Clipboard APIs unavailable or blocked.")},[F,r]),a=T(async()=>{if(U)return;if(!confirm("Regenerate the widget token? Existing macOS widgets using the old token will stop updating."))return;z(!0);try{let I=await fetch("/agent/settings/widget-token/regenerate",{method:"POST"}),V=await I.json().catch(()=>({}));if(!I.ok||!V?.ok||!V?.settings)throw Error(V?.error||"Failed to regenerate widget token.");y(V.settings.widgetToken||""),i?.(V.settings),H(!0),setTimeout(()=>{if(L.current)H(!1)},4000)}catch(I){console.warn("[settings/general] Failed to regenerate widget token.",I)}finally{if(L.current)z(!1)}},[U,i]),un=typeof window<"u"&&window.isSecureContext,ln=F?"•".repeat(Math.min(Math.max(F.length,16),48)):"—",wn=K?F||"—":ln;return l`
        <div class="settings-section">
            ${t&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Identity</h3>
            <div class="settings-row">
                <label>User</label>
                <${m_} value=${u} onChange=${f} />
                <input type="text" value=${_} onInput=${(I)=>c(I.target.value)} placeholder="Your name" />
            </div>
            <div class="settings-row">
                <label>Agent</label>
                <${m_} value=${$} onChange=${b} />
                <input type="text" value=${o} onInput=${(I)=>s(I.target.value)} placeholder="Agent name" />
            </div>

            <h3 style="margin-top:20px">Notifications</h3>
            ${un?l`
                <div class="settings-row">
                    <label>Browser notifications</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="settings-hint" style="margin:0">
                            Use the 🔔 bell button in the compose bar to enable/disable notifications.
                            Web Push requires HTTPS or localhost.
                        </span>
                    </div>
                </div>
            `:l`
                <div class="settings-row">
                    <label>Browser notifications</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="settings-hint" style="margin:0; color: var(--error-color, #e55)">
                            ⚠ Not available — requires a secure context (HTTPS or localhost).
                            Access via SSH tunnel or reverse proxy with TLS to enable.
                        </span>
                    </div>
                </div>
            `}

            <h3 style="margin-top:20px">Display</h3>
            <div class="settings-row">
                <label>System meters</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${j}
                        onChange=${()=>{let I=Hr(!j);X(I)}} />
                    <span class="settings-hint" style="margin:0">CPU/memory/network meters in the status bar. This browser only.</span>
                </div>
            </div>

            <h3 style="margin-top:20px">Instance Configuration</h3>
            <div class="settings-row">
                <label>Compose upload (MB)</label>
                <${e}
                    label="compose upload limit"
                    value=${g}
                    min=${1}
                    max=${512}
                    fallback=${32}
                    width="80px"
                    onChange=${p}
                />
                <span class="settings-hint" style="margin:0">chat/media attachments</span>
            </div>
            <div class="settings-row">
                <label>Workspace upload (MB)</label>
                <${e}
                    label="workspace upload limit"
                    value=${h}
                    min=${1}
                    max=${1024}
                    fallback=${256}
                    width="80px"
                    onChange=${v}
                />
                <span class="settings-hint" style="margin:0">defaults to 256 MB; chunked uploads allow up to 1 GB</span>
            </div>

            <h3 style="margin-top:20px">Authentication</h3>
            <div class="settings-row settings-row-vertical settings-widget-token-row">
                <label>Widget bearer token</label>
                <div class="settings-keychain-reveal-panel settings-widget-token-panel">
                    <div class="settings-keychain-reveal-field settings-widget-token-field">
                        <span class="settings-keychain-reveal-label">Token</span>
                        <code class="settings-keychain-reveal-value settings-widget-token-value">${wn}</code>
                        <button class=${`settings-keychain-reveal-btn${K?" active":""}`}
                            type="button"
                            onClick=${()=>W((I)=>!I)}
                            disabled=${!F}
                            title=${K?"Hide token":"Reveal token"}>
                            ${K?l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                        </button>
                        <button class="settings-keychain-copy-btn" type="button" onClick=${gn} disabled=${!F} title="Copy token">
                            ${N?l`<span class="settings-widget-token-copied">Copied</span>`:l`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`}
                        </button>
                        <button class="settings-keychain-prompt-submit settings-widget-token-regenerate" type="button" onClick=${a} disabled=${U}>${U?"Regenerating…":"Regenerate"}</button>
                    </div>
                </div>
                <span class="settings-hint" style="margin:6px 0 0 0;">
                    Read-only token for <code>GET /api/state</code> and <code>GET /api/state/events</code>. Use as <code>Authorization: Bearer …</code>.
                </span>
            </div>
            <div class="settings-totp-panel">
                <div class="settings-totp-header">
                    <div>
                        <strong>TOTP setup QR</strong>
                        <div class="settings-hint" style="margin:6px 0 0 0;">
                            ${O.configured?"Current web-login authenticator secret. Scan this QR to add another authenticator device.":"TOTP is not configured for this instance yet, so no setup QR is available."}
                        </div>
                    </div>
                </div>
                ${O.configured?l`
                    <div class="settings-totp-grid">
                        <div class="settings-totp-qr" dangerouslySetInnerHTML=${{__html:O.qrSvg}}></div>
                        <div class="settings-totp-meta">
                            <div class="settings-row settings-row-vertical">
                                <label>Issuer</label>
                                <input type="text" readonly value=${O.issuer||""} />
                            </div>
                            <div class="settings-row settings-row-vertical">
                                <label>Label</label>
                                <input type="text" readonly value=${O.label||""} />
                            </div>
                            <div class="settings-row settings-row-vertical">
                                <label>Secret</label>
                                <input type="text" readonly value=${O.secret||""} />
                            </div>
                        </div>
                    </div>
                `:null}
            </div>
        </div>
    `}var nc=Y(()=>{m();E_();Cn()});var ic={};_n(ic,{SessionsSection:()=>fl});function rc(n={}){return{sessionAutoRotate:n.sessionAutoRotate!==!1,sessionMaxSizeMb:n.sessionMaxSizeMb??16,sessionMaxLines:n.sessionMaxLines??4000,sessionMaxCompactions:n.sessionMaxCompactions??3,sessionIsolation:n.sessionIsolation||"none",toolUseBudget:n.toolUseBudget??64}}function fl({settingsData:n,setStatus:r,mergeSettingsData:i}){let[_,c]=w(!0),[u,f]=w(16),[o,s]=w(4000),[$,b]=w(3),[g,p]=w(64),[h,v]=w("none"),[F,y]=w(!1),K=Z(""),W=Z(null),N=Z(!0);P(()=>{return N.current=!0,()=>{N.current=!1}},[]);let B=T((z)=>{let j=rc(z);c(j.sessionAutoRotate),f(j.sessionMaxSizeMb),s(j.sessionMaxLines),b(j.sessionMaxCompactions),p(j.toolUseBudget),v(j.sessionIsolation),K.current=JSON.stringify(j)},[]);P(()=>{B(n||{})},[n,B]);let U=D(()=>JSON.stringify(rc({sessionAutoRotate:_,sessionMaxSizeMb:u,sessionMaxLines:o,sessionMaxCompactions:$,toolUseBudget:g,sessionIsolation:h})),[_,u,o,$,g,h]);return P(()=>{if(U===K.current)return;if(W.current)clearTimeout(W.current);return W.current=setTimeout(async()=>{if(!N.current)return;let z=document.activeElement;if(z&&z.closest?.(".settings-number-stepper"))return;try{let j=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:U}),X=await j.json().catch(()=>({}));if(!N.current)return;if(!j.ok||!X?.ok||!X?.settings)return;K.current=U,i?.(X.settings),y(!0),setTimeout(()=>{if(N.current)y(!1)},4000)}catch(j){console.warn("[settings/sessions] Failed to persist session settings.",j)}},800),()=>{if(W.current)clearTimeout(W.current)}},[U,i]),l`
        <div class="settings-section">
            ${F&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Session Lifecycle</h3>
            <div class="settings-row">
                <label>Auto-rotate sessions</label>
                <input type="checkbox" checked=${_} onChange=${(z)=>c(z.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Max session size (MB)</label>
                <${e}
                    label="max session size"
                    value=${u}
                    min=${1}
                    max=${256}
                    fallback=${32}
                    width="80px"
                    onChange=${f}
                />
            </div>

            <h3 style="margin-top:20px">Agent Behaviour</h3>
            <div class="settings-row">
                <label>Tool use budget</label>
                <${e}
                    label="tool use budget"
                    value=${g}
                    min=${8}
                    max=${512}
                    fallback=${64}
                    width="80px"
                    onChange=${p}
                />
                <span class="settings-hint" style="margin:0">max tool-call messages per turn</span>
            </div>
            <div class="settings-row">
                <label>Session isolation</label>
                <select value=${h} onChange=${(z)=>v(z.target.value)}>
                    <option value="none">None — full cross-session visibility</option>
                    <option value="summary">Summary — tools visible, no arguments</option>
                    <option value="full">Full — sessions cannot see each other</option>
                </select>
            </div>
        </div>
    `}var _c=Y(()=>{m();Cn()});var cc={};_n(cc,{__recordingsSettingsTest:()=>gl,RecordingsSection:()=>sl});function Gr(n){if(!n)return"—";let r=new Date(n);if(Number.isNaN(r.getTime()))return n;return r.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Ui(n){if(n==="full")return"full / trusted";if(n==="metadata")return"metadata only";return"redacted"}function Nr({children:n,type:r="neutral"}){return l`<span class=${`settings-task-pill settings-task-pill-${r}`}>${n}</span>`}function ll(){if(typeof window>"u")return"web:default";return String(window.__piclawCurrentChatJid||"web:default")}function lr(n){return String(n||"").split(`
`).map((r)=>r.trim()).filter(Boolean)}function ol({recording:n,details:r,onDelete:i,onRefresh:_}){if(!n)return l`<div class="settings-task-detail-empty">Select a recording to inspect, replay, export, or delete it.</div>`;let c=r?.meta||n,u=Array.isArray(r?.events)?r.events:[],f=u.reduce((s,$)=>s+(Array.isArray($.redactions)?$.redactions.length:0),0),o=u.reduce((s,$)=>{let b=$.kind||"event";return s[b]=(s[b]||0)+1,s},{});return l`
        <div class="settings-task-detail settings-recording-detail">
            <div class="settings-task-detail-header">
                <div>
                    <h4>${c.title||c.id}</h4>
                    <code>${c.id}</code>
                </div>
                <div class="settings-task-detail-actions">
                    <button onClick=${()=>window.open(hi(c.id),"_blank","noopener,noreferrer")}>Playback</button>
                    <button onClick=${_}>Refresh</button>
                    <button class="danger" onClick=${()=>i(c)}>Delete</button>
                </div>
            </div>
            <div class="settings-task-detail-grid">
                <span>Status</span><strong>${c.status||"—"}</strong>
                <span>Mode</span><strong>${Ui(c.mode)}</strong>
                <span>Chat</span><code>${c.chatJid||"—"}</code>
                <span>Started</span><strong>${Gr(c.startedAt)}</strong>
                <span>Ended</span><strong>${Gr(c.endedAt)}</strong>
                <span>Events</span><strong>${c.eventCount??u.length}</strong>
                <span>Redactions</span><strong>${f}</strong>
            </div>
            <div class="settings-recording-export-row">
                <a href=${fr(c.id,"json")}>Export JSON</a>
                <a href=${fr(c.id,"jsonl")}>Export JSONL</a>
                <a href=${fr(c.id,"html")}>Export standalone HTML</a>
            </div>
            <h4>Event summary</h4>
            ${u.length===0&&l`<p class="settings-hint">Open or refresh details to inspect trace events.</p>`}
            ${u.length>0&&l`
                <div class="settings-recording-event-summary">
                    ${Object.entries(o).map(([s,$])=>l`<${Nr}>${s}: ${$}<//>`)}
                </div>
                <div class="settings-task-command-block">
                    <strong>First events</strong>
                    <pre>${JSON.stringify(u.slice(0,5),null,2)}</pre>
                </div>
            `}
        </div>
    `}function sl({filter:n="",setStatus:r}){let[i,_]=w([]),[c,u]=w([]),[f,o]=w(!0),[s,$]=w(null),[b,g]=w(null),[p,h]=w(null),[v,F]=w(!1),[y,K]=w(ll),[W,N]=w(""),[B,U]=w("redacted"),[z,j]=w(!0),[X,t]=w(""),[H,k]=w(""),[x,L]=w('{"Authorization":"Bearer abc1234567890","content":"hello"}'),[Q,C]=w(null);P(()=>{let G=(d)=>{let cn=String(d?.detail?.chatJid||"").trim();if(cn)K(cn)};return window.addEventListener("piclaw:current-chat-changed",G),()=>window.removeEventListener("piclaw:current-chat-changed",G)},[]);let O=T(async(G=b)=>{o(!0),$(null);try{let d=await wi(),cn=d.recordings||[];_(cn),u(d.active||[]);let Bn=cn.find((R)=>R.id===G)||cn[0]||null;if(g(Bn?.id||null),Bn?.id)h(await Tr(Bn.id));else h(null)}catch(d){$(d?.message||"Failed to load recordings.")}finally{o(!1)}},[b]);P(()=>{O()},[O]);let gn=D(()=>i.find((G)=>G.id===b)||null,[i,b]),a=D(()=>c.find((G)=>G.chatJid===y)||null,[c,y]),un=String(n||"").trim().toLowerCase(),ln=D(()=>{if(!un)return i;return i.filter((G)=>[G.id,G.title,G.chatJid,G.status,G.mode].some((d)=>String(d||"").toLowerCase().includes(un)))},[i,un]),wn=T(async(G)=>{if(g(G?.id||null),h(null),!G?.id)return;try{h(await Tr(G.id))}catch(d){r?.(d?.message||"Failed to load recording.","error")}},[r]),I=T(async()=>{if(v)return;F(!0);try{let G={keys:lr(X),patterns:lr(H)},d=await ti({chat_jid:y,title:W||void 0,mode:B,include_timeline_snapshot:z,timeline_snapshot_limit:80,redaction:G});r?.(`Recording started for ${y}.`,"success"),await O(d?.recording?.id)}catch(G){r?.(G?.message||"Failed to start recording.","error")}finally{F(!1)}},[v,y,X,H,z,O,B,r,W]),V=T(async(G=a)=>{if(!G||v)return;F(!0);try{let d=await yi({id:G.id});r?.(`Recording stopped for ${G.chatJid}.`,"success"),await O(d?.recording?.id)}catch(d){r?.(d?.message||"Failed to stop recording.","error")}finally{F(!1)}},[v,a,O,r]),q=T(async(G)=>{if(!G||v)return;if(!window.confirm(`Delete recording ${G.id}?

${G.title||""}`))return;F(!0);try{await xi(G.id),r?.("Recording deleted.","success"),await O(null)}catch(d){r?.(d?.message||"Failed to delete recording.","error")}finally{F(!1)}},[v,O,r]),yn=T(async()=>{try{let G=JSON.parse(x||"null"),d=await vi(G,{mode:B,redaction:{keys:lr(X),patterns:lr(H)}});C(d.preview)}catch(G){C({error:G?.message||"Preview failed."})}},[X,H,B,x]);return l`
        <div class="settings-section settings-recordings-section">
            <div class="settings-recording-start-card">
                <h3>Session Recording</h3>
                <p class="settings-hint">Opt-in trace capture for deterministic playback and screen-recording exports. Playback never calls live agent or tool endpoints.</p>
                <div class="settings-recording-form-grid">
                    <label>Chat JID<input value=${y} onInput=${(G)=>K(G.target.value)} /></label>
                    <label>Title<input placeholder="Demo recording" value=${W} onInput=${(G)=>N(G.target.value)} /></label>
                    <label>Mode<select value=${B} onChange=${(G)=>U(G.target.value)}><option value="redacted">Redacted</option><option value="metadata">Metadata only</option><option value="full">Full / trusted local</option></select></label>
                    <label class="settings-recording-checkbox"><input type="checkbox" checked=${z} onChange=${(G)=>j(G.target.checked)} /> Include timeline snapshot</label>
                </div>
                <div class="settings-recording-form-grid settings-recording-redaction-grid">
                    <label>Extra redacted keys<textarea rows="2" placeholder="customer_id\ninternal_code" value=${X} onInput=${(G)=>t(G.target.value)} /></label>
                    <label>Extra regex patterns<textarea rows="2" placeholder="ACME-[0-9]+" value=${H} onInput=${(G)=>k(G.target.value)} /></label>
                </div>
                <div class="settings-task-detail-actions">
                    ${a?l`<button onClick=${()=>V(a)} disabled=${v}>Stop current chat recording</button>`:l`<button onClick=${I} disabled=${v}>Start recording</button>`}
                    <button onClick=${()=>O()} disabled=${f}>Refresh</button>
                </div>
                ${c.length>0&&l`<div class="settings-recording-active-row">${c.map((G)=>l`<${Nr} type="active">REC ${G.chatJid}<//>`)}</div>`}
            </div>

            <details class="settings-recording-preview">
                <summary>Redaction preview</summary>
                <textarea rows="4" value=${x} onInput=${(G)=>L(G.target.value)} />
                <div class="settings-task-detail-actions"><button onClick=${yn}>Preview redaction</button></div>
                ${Q&&l`<pre>${JSON.stringify(Q,null,2)}</pre>`}
            </details>

            ${f&&l`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading recordings…</span></div>`}
            ${s&&l`<div class="settings-error-state">${s}</div>`}
            ${!f&&!s&&i.length===0&&l`<div class="settings-empty-state"><strong>No recordings yet.</strong><p>Start a recording above, then use playback/export for deterministic screen capture.</p></div>`}
            ${!f&&!s&&i.length>0&&l`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Session recordings">
                        ${ln.map((G)=>l`
                            <button class=${`settings-task-row ${G.id===b?"active":""}`} onClick=${()=>wn(G)}>
                                <span class="settings-task-row-main"><strong>${G.title||G.id}</strong><span>${G.chatJid} · ${Gr(G.startedAt)}</span></span>
                                <span class="settings-task-row-meta"><${Nr} type=${G.status==="recording"?"active":"completed"}>${G.status}<//><${Nr}>${Ui(G.mode)}<//></span>
                                <span class="settings-task-row-times">${G.eventCount||0} events</span>
                            </button>
                        `)}
                        ${ln.length===0&&l`<p class="settings-hint">No recordings match “${n}”.</p>`}
                    </div>
                    <${ol} recording=${gn} details=${p} onDelete=${q} onRefresh=${()=>gn&&wn(gn)} />
                </div>
            `}
        </div>
    `}var gl;var uc=Y(()=>{m();Kn();gl={formatDateTime:Gr,modeLabel:Ui,parseList:lr}});var fc={};_n(fc,{CompactionSection:()=>wl});function $l(n={}){return{compactionTimeoutSec:n.compactionTimeoutSec??180,compactionBackoffBaseMin:n.compactionBackoffBaseMin??15,compactionBackoffMaxMin:n.compactionBackoffMaxMin??360,compactionThresholdPercent:n.compactionThresholdPercent??75,compactionBackoffDecayFactor:n.compactionBackoffDecayFactor??0.5,toolResultCompactionEnabled:Boolean(n.toolResultCompactionEnabled??!0),toolResultSemanticSummaryEnabled:Boolean(n.toolResultSemanticSummaryEnabled??!0),toolResultSemanticSummaryMaxInputChars:n.toolResultSemanticSummaryMaxInputChars??12000,toolResultSemanticSummaryMaxTokens:n.toolResultSemanticSummaryMaxTokens??320,toolResultSemanticSummaryTimeoutSec:n.toolResultSemanticSummaryTimeoutSec??12,progressWatchdogEnabled:Boolean(n.progressWatchdogEnabled??!1),progressWatchdogTimeoutSec:n.progressWatchdogTimeoutSec??120,compactionBackoffs:Array.isArray(n.compactionBackoffs)?n.compactionBackoffs:[],progressWatchdogPhases:Array.isArray(n.progressWatchdogPhases)?n.progressWatchdogPhases:[]}}function Hi(n){let r=String(n||"").trim();if(!r)return"—";let i=new Date(r);if(Number.isNaN(i.getTime()))return r;return i.toLocaleString()}function wl({settingsData:n,setStatus:r,mergeSettingsData:i}){let[_,c]=w(180),[u,f]=w(15),[o,s]=w(360),[$,b]=w(75),[g,p]=w(0.5),[h,v]=w(!0),[F,y]=w(!0),[K,W]=w(12000),[N,B]=w(320),[U,z]=w(12),[j,X]=w(!1),[t,H]=w(120),[k,x]=w([]),[L,Q]=w([]),[C,O]=w(!1),gn=Z(""),a=Z(null),un=Z(!0);P(()=>{return un.current=!0,()=>{un.current=!1}},[]);let ln=T((V)=>{let q=$l(V);c(q.compactionTimeoutSec),f(q.compactionBackoffBaseMin),s(q.compactionBackoffMaxMin),b(q.compactionThresholdPercent),p(q.compactionBackoffDecayFactor),v(q.toolResultCompactionEnabled),y(q.toolResultSemanticSummaryEnabled),W(q.toolResultSemanticSummaryMaxInputChars),B(q.toolResultSemanticSummaryMaxTokens),z(q.toolResultSemanticSummaryTimeoutSec),X(q.progressWatchdogEnabled),H(q.progressWatchdogTimeoutSec),x(q.compactionBackoffs),Q(q.progressWatchdogPhases),gn.current=JSON.stringify({compactionTimeoutSec:q.compactionTimeoutSec,compactionBackoffBaseMin:q.compactionBackoffBaseMin,compactionBackoffMaxMin:q.compactionBackoffMaxMin,compactionThresholdPercent:q.compactionThresholdPercent,compactionBackoffDecayFactor:q.compactionBackoffDecayFactor,toolResultCompactionEnabled:q.toolResultCompactionEnabled,toolResultSemanticSummaryEnabled:q.toolResultSemanticSummaryEnabled,toolResultSemanticSummaryMaxInputChars:q.toolResultSemanticSummaryMaxInputChars,toolResultSemanticSummaryMaxTokens:q.toolResultSemanticSummaryMaxTokens,toolResultSemanticSummaryTimeoutSec:q.toolResultSemanticSummaryTimeoutSec,progressWatchdogEnabled:q.progressWatchdogEnabled,progressWatchdogTimeoutSec:q.progressWatchdogTimeoutSec})},[]);P(()=>{ln(n||{})},[n,ln]);let wn=D(()=>JSON.stringify({compactionTimeoutSec:_,compactionBackoffBaseMin:u,compactionBackoffMaxMin:o,compactionThresholdPercent:$,compactionBackoffDecayFactor:g,toolResultCompactionEnabled:h,toolResultSemanticSummaryEnabled:F,toolResultSemanticSummaryMaxInputChars:K,toolResultSemanticSummaryMaxTokens:N,toolResultSemanticSummaryTimeoutSec:U,progressWatchdogEnabled:j,progressWatchdogTimeoutSec:t}),[_,u,o,$,g,h,F,K,N,U,j,t]);P(()=>{if(wn===gn.current)return;if(a.current)clearTimeout(a.current);return a.current=setTimeout(async()=>{if(!un.current)return;try{r?.("Saving compaction settings…","info");let V=await fetch("/agent/settings/compaction",{method:"POST",headers:{"Content-Type":"application/json"},body:wn}),q=await V.json().catch(()=>({}));if(!un.current)return;if(!V.ok||!q?.ok||!q?.settings){r?.(q?.error||"Failed to save compaction settings.","error");return}gn.current=wn,i?.(q.settings),ln({...n||{},...q.settings||{}}),r?.("Compaction settings saved.","success"),O(!0),setTimeout(()=>{if(un.current)O(!1),r?.(null)},4000)}catch(V){if(console.warn("[settings/compaction] Failed to persist compaction settings.",V),un.current)r?.("Failed to save compaction settings.","error")}},800),()=>{if(a.current)clearTimeout(a.current)}},[wn,i,r,ln,n]);let I=T(async(V)=>{try{r?.(`Clearing compaction suppression for ${V}…`,"info");let q=await fetch("/agent/settings/compaction/reset-backoff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatJid:V})}),yn=await q.json().catch(()=>({}));if(!q.ok||!yn?.ok||!yn?.settings){r?.(yn?.error||"Failed to clear compaction suppression.","error");return}i?.(yn.settings),ln({...n||{},...yn.settings||{}}),r?.(`Cleared compaction suppression for ${V}.`,"success")}catch(q){console.warn("[settings/compaction] Failed to clear compaction suppression.",q),r?.("Failed to clear compaction suppression.","error")}},[ln,i,r,n]);return l`
        <div class="settings-section">
            ${C&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Compaction settings applied. Existing turns keep their current timers; new turns use the updated values.
                </div>
            `}

            <h3>Automatic compaction</h3>
            <div class="settings-row">
                <label>Enable tool-result compaction</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${h} onChange=${(V)=>v(Boolean(V.target.checked))} />
                    <span class="settings-hint" style="margin:0">When disabled, large tool results stay inline and are not externalized into searchable tool-output handles.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Semantic summaries for compacted tool results</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${F} onChange=${(V)=>y(Boolean(V.target.checked))} />
                    <span class="settings-hint" style="margin:0">When enabled, compacted outputs include a semantic summary generated with the active model (preview fallback on failure).</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Semantic summary input limit (chars)</label>
                <${e}
                    label="semantic summary input limit"
                    value=${K}
                    min=${500}
                    max=${200000}
                    fallback=${12000}
                    width="100px"
                    disabled=${!F}
                    onChange=${W}
                />
                <span class="settings-hint" style="margin:0">Maximum characters sampled from full tool output for semantic summarization.</span>
            </div>
            <div class="settings-row">
                <label>Semantic summary output max tokens</label>
                <${e}
                    label="semantic summary max tokens"
                    value=${N}
                    min=${64}
                    max=${4096}
                    fallback=${320}
                    width="90px"
                    disabled=${!F}
                    onChange=${B}
                />
                <span class="settings-hint" style="margin:0">Upper bound for generated summary length.</span>
            </div>
            <div class="settings-row">
                <label>Semantic summary timeout (sec)</label>
                <${e}
                    label="semantic summary timeout"
                    value=${U}
                    min=${1}
                    max=${300}
                    fallback=${12}
                    width="90px"
                    disabled=${!F}
                    onChange=${z}
                />
                <span class="settings-hint" style="margin:0">Abort semantic summary generation after this timeout and fall back to preview compaction.</span>
            </div>
            <div class="settings-row">
                <label>Compaction threshold (%)</label>
                <${e}
                    label="compaction threshold"
                    value=${$}
                    min=${10}
                    max=${95}
                    fallback=${75}
                    width="80px"
                    onChange=${b}
                />
                <span class="settings-hint" style="margin:0">auto-compact when context exceeds this % of window</span>
            </div>
            <div class="settings-row">
                <label>Compaction timeout (sec)</label>
                <${e}
                    label="compaction timeout"
                    value=${_}
                    min=${1}
                    max=${3600}
                    fallback=${180}
                    width="90px"
                    onChange=${c}
                />
                <span class="settings-hint" style="margin:0">Abort a stuck pre-prompt/manual compaction instead of hanging forever.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff base (min)</label>
                <${e}
                    label="compaction backoff base"
                    value=${u}
                    min=${1}
                    max=${1440}
                    fallback=${15}
                    width="90px"
                    onChange=${f}
                />
                <span class="settings-hint" style="margin:0">First suppression window after a compaction failure.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff max (min)</label>
                <${e}
                    label="compaction backoff max"
                    value=${o}
                    min=${1}
                    max=${10080}
                    fallback=${360}
                    width="90px"
                    onChange=${s}
                />
                <span class="settings-hint" style="margin:0">Upper bound for exponential suppression after repeated failures.</span>
            </div>

            <div class="settings-row">
                <label>Backoff decay factor</label>
                <${e}
                    label="backoff decay factor"
                    value=${Math.round(g*100)}
                    min=${10}
                    max=${100}
                    fallback=${50}
                    width="80px"
                    onChange=${(V)=>p(V/100)}
                />
                <span class="settings-hint" style="margin:0">% — halves backoff after each successful compaction</span>
            </div>

            <h3 style="margin-top:20px">Stall watchdog</h3>
            <div class="settings-row">
                <label>Enable watchdog</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${j} onChange=${(V)=>X(Boolean(V.target.checked))} />
                    <span class="settings-hint" style="margin:0">Disabled by default. When enabled, a helper process terminates the runtime if an active phase stops heartbeating.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Watchdog timeout (sec)</label>
                <${e}
                    label="watchdog timeout"
                    value=${t}
                    min=${0}
                    max=${3600}
                    fallback=${120}
                    width="90px"
                    disabled=${!j}
                    onChange=${H}
                />
                <span class="settings-hint" style="margin:0">How long an active phase can go without a heartbeat before the watchdog kills the runtime.</span>
            </div>

            <h3 style="margin-top:20px">Active compaction suppressions</h3>
            ${k.length===0?l`
                <p class="settings-hint">No chats are currently under compaction backoff.</p>
            `:l`
                <div class="settings-table-wrapper">
                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>Chat</th>
                                <th>Failures</th>
                                <th>Suppressed until</th>
                                <th>Last error</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${k.map((V)=>l`
                                <tr>
                                    <td><code>${V.chatJid}</code></td>
                                    <td>${V.failureCount}</td>
                                    <td>${Hi(V.backoffUntil)}</td>
                                    <td title=${V.lastErrorMessage||""}>${V.lastErrorMessage||"—"}</td>
                                    <td>
                                        <button class="settings-secondary-btn" onClick=${()=>I(V.chatJid)}>
                                            Clear
                                        </button>
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}

            <h3 style="margin-top:20px">Live watchdog phases</h3>
            ${L.length===0?l`
                <p class="settings-hint">No active tracked phases right now.</p>
            `:l`
                <div class="settings-table-wrapper">
                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>Chat</th>
                                <th>Phase</th>
                                <th>Started</th>
                                <th>Last heartbeat</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${L.map((V)=>l`
                                <tr>
                                    <td><code>${V.chatJid}</code></td>
                                    <td>${V.phase}</td>
                                    <td>${Hi(V.startedAt)}</td>
                                    <td>${Hi(V.lastProgressAt)}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `}var lc=Y(()=>{m();Cn()});function sc(n){let r=String(n||"").trim().toLowerCase();if(!r)return null;let i=xl[r]||r;if(/^f(?:[1-9]|1[0-2])$/.test(i))return i;if(hl.has(i))return i;if(i.length===1)return i;if(/^[a-z0-9]+$/.test(i))return i;return null}function On(n){let r=String(n||"").trim();if(!r)return null;let i=r.split("+").map((u)=>u.trim()).filter(Boolean);if(!i.length)return null;let _={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let u of i){let f=u.toLowerCase(),o=yl[f];if(o){_[o]=!0;continue}if(_.key)return null;let s=sc(u);if(!s||s==="escape")return null;_.key=s}if(!_.key)return null;let c=[];if(_.ctrl)c.push("ctrl");if(_.meta)c.push("meta");if(_.alt)c.push("alt");if(_.shift)c.push("shift");return c.push(_.key),c.join("+")}function gc(n){return String(n||"").split(/[\n,]/).map((r)=>On(r)).filter((r)=>Boolean(r))}function jn(n){return n.join(", ")}function Ni(){let n=Y_(oc);if(!n||typeof n!=="object")return{};let r={};for(let i of or){let _=n[i.id];if(!Array.isArray(_))continue;let c=_.map((u)=>On(String(u||""))).filter((u)=>Boolean(u));r[i.id]=[...new Set(c)]}return r}function Li(n){if(fn(oc,JSON.stringify(n)),typeof window<"u")window.dispatchEvent(new CustomEvent("piclaw:keyboard-shortcuts-changed",{detail:{config:n}}))}function $c(n){return tl.get(n)}function sr(n){let r=Ni()[n];if(Array.isArray(r))return r;return[...$c(n).defaultBindings]}function wc(n,r){let i=Ni(),_=$c(n).defaultBindings,c=[...new Set(r.map((u)=>On(u)).filter((u)=>Boolean(u)))];if(c.length===_.length&&c.every((u,f)=>u===_[f]))delete i[n];else i[n]=c;Li(i)}function Gi(n){if(!n){Li({});return}let r=Ni();delete r[n],Li(r)}function Vr(){let n={};for(let r of or)n[r.id]=sr(r.id);return n}function vl(n){let r=typeof n==="string"?n:"";if(!r)return"";if(r.length===1)return r.toLowerCase();return sc(r)||r.toLowerCase()}function bl(n){let r=On(n);if(!r)return null;let i={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let _ of r.split("+")){if(_==="ctrl"||_==="meta"||_==="alt"||_==="shift"){i[_]=!0;continue}i.key=_}return i.key?i:null}function pl(n,r){let i=bl(r);if(!i)return!1;if(vl(n?.key)!==i.key)return!1;let c=!i.shift&&i.key.length===1&&/[^a-z0-9]/i.test(i.key);return Boolean(n?.ctrlKey)===i.ctrl&&Boolean(n?.metaKey)===i.meta&&Boolean(n?.altKey)===i.alt&&(c||Boolean(n?.shiftKey)===i.shift)}function Vo(n,r){return sr(r).some((i)=>pl(n,i))}var oc="piclaw_keyboard_shortcuts_v1",or,tl,yl,xl,hl;var tc=Y(()=>{or=[{id:"openHelp",label:"Open keyboard help",description:"Open Settings → Keyboard. Default: question mark and quote when focus is outside compose and other editable fields.",defaultBindings:["?",'"']},{id:"openSettings",label:"Open settings",description:"Open the settings dialog.",defaultBindings:["ctrl+,","meta+,","alt+,"]},{id:"previousChat",label:"Previous session",description:"Switch to the previous visible chat/session.",defaultBindings:["["]},{id:"nextChat",label:"Next session",description:"Switch to the next visible chat/session.",defaultBindings:["]"]},{id:"toggleDock",label:"Toggle dock",description:"Show or hide the bottom dock panes.",defaultBindings:["ctrl+`"]},{id:"toggleZenMode",label:"Toggle zen mode",description:"Collapse surrounding chrome for a focused chat view.",defaultBindings:["ctrl+shift+z","meta+shift+z"]}],tl=new Map(or.map((n)=>[n.id,n])),yl={cmd:"meta",command:"meta",meta:"meta",super:"meta",ctrl:"ctrl",control:"ctrl",alt:"alt",option:"alt",shift:"shift"},xl={esc:"escape",return:"enter",spacebar:"space"},hl=new Set(["tab","enter","space","backspace","delete","insert","clear","home","end","pageup","pagedown","up","down","left","right"])});var yc={};_n(yc,{KeyboardSection:()=>zl});function Kl(n,r,i){let _=String(n||"").trim().toLowerCase();if(!_)return!0;return[r.label,r.description,i,...r.defaultBindings||[]].some((c)=>String(c||"").toLowerCase().includes(_))}function zl({filter:n="",setStatus:r}){let[i,_]=w(()=>{let s=Vr();return Object.fromEntries(Object.entries(s).map(([$,b])=>[$,jn(b)]))});P(()=>{let s=()=>{let $=Vr();_(Object.fromEntries(Object.entries($).map(([b,g])=>[b,jn(g)])))};return window.addEventListener("piclaw:keyboard-shortcuts-changed",s),()=>window.removeEventListener("piclaw:keyboard-shortcuts-changed",s)},[]);let c=D(()=>or.filter((s)=>{let $=String(i[s.id]||"");return Kl(n,s,$)}),[i,n]),u=(s)=>{let $=String(i[s]||"").trim(),g=($?$.split(/[\n,]/).map((h)=>h.trim()).filter(Boolean):[]).filter((h)=>!On(h));if(g.length>0){r?.(`Invalid shortcut: ${g[0]}. Escape is reserved and cannot be rebound.`,"error");return}let p=gc($);wc(s,p),_((h)=>({...h,[s]:jn(sr(s))})),r?.("Keyboard shortcuts saved.","success")},f=(s)=>{Gi(s),_(($)=>({...$,[s]:jn(sr(s))})),r?.("Keyboard shortcut reset to default.","success")};return l`
        <div class="settings-section">
            <h3>Keyboard</h3>
            <p class="settings-hint">
                Customize app-wide shortcuts as comma-separated bindings. Changes apply immediately.
                <code>Escape</code> is reserved for dismiss/abort and cannot be rebound.
            </p>
            <p class="settings-hint">
                <code>/help</code> and typing <code>"</code> outside the compose box open this pane.
            </p>

            <div class="settings-row" style="align-items:center; gap:10px; margin-bottom:18px; justify-content:flex-end;">
                <button class="settings-addon-btn" style="min-width:180px; height:40px; font-size:14px;" onClick=${()=>{Gi();let s=Vr();_(Object.fromEntries(Object.entries(s).map(([$,b])=>[$,jn(b)]))),r?.("Keyboard shortcuts reset to defaults.","success")}}>Reset all to defaults</button>
            </div>

            <div class="settings-shortcut-list" style="display:grid; gap:16px;">
                ${c.map((s)=>l`
                    <div class="settings-shortcut-card" key=${s.id} style="display:grid; grid-template-columns:minmax(240px, 1.25fr) minmax(320px, 1fr); gap:18px; align-items:start; padding:18px 20px; border:1px solid var(--border-color, rgba(120,120,120,.22)); border-radius:16px; background:var(--panel-bg, rgba(255,255,255,.04));">
                        <div class="settings-shortcut-copy" style="min-width:0;">
                            <div class="settings-shortcut-title" style="font-size:17px; font-weight:700; line-height:1.3;">${s.label}</div>
                            <div class="settings-hint" style="margin:6px 0 0 0; font-size:14px; line-height:1.5;">${s.description}</div>
                            <div class="settings-shortcut-default" style="margin-top:10px; font-size:13px; color:var(--text-secondary);">Default: <code style="font-size:13px;">${jn(s.defaultBindings)}</code></div>
                        </div>
                        <div class="settings-shortcut-controls" style="display:grid; gap:10px; min-width:0;">
                            <input
                                type="text"
                                value=${i[s.id]||""}
                                placeholder=${jn(s.defaultBindings)}
                                onInput=${($)=>_((b)=>({...b,[s.id]:$.target.value}))}
                                style="width:100%; min-height:46px; padding:10px 14px; font-size:16px; line-height:1.35; font-family:var(--font-mono, ui-monospace, monospace); border-radius:12px;"
                            />
                            <div class="settings-shortcut-actions" style="display:flex; justify-content:flex-end; align-items:center; gap:10px; flex-wrap:wrap;">
                                <button class="settings-addon-btn settings-addon-btn-install" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>u(s.id)}>Save</button>
                                <button class="settings-addon-btn" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>f(s.id)}>Default</button>
                            </div>
                        </div>
                    </div>
                `)}
                ${c.length===0&&l`<div class="settings-hint">No shortcuts match this filter.</div>`}
            </div>
        </div>
    `}var xc=Y(()=>{m();tc()});function bc(n,r=Vi){let i=Number(n);if(!Number.isFinite(i))return r;return Math.min(300,Math.max(15,Math.round(i)))}function pc(n,r=Pi){let i=Number(n);if(!Number.isFinite(i))return r;return Math.min(8,Math.max(0,Math.round(i)))}function Xi(){return{refreshIntervalSec:bc(ji(hc,Vi),Vi),folderPreviewDepth:pc(ji(vc,Pi),Pi)}}function Kc(n={}){let r=Xi(),i={refreshIntervalSec:bc(Object.prototype.hasOwnProperty.call(n,"refreshIntervalSec")?n.refreshIntervalSec:r.refreshIntervalSec,r.refreshIntervalSec),folderPreviewDepth:pc(Object.prototype.hasOwnProperty.call(n,"folderPreviewDepth")?n.folderPreviewDepth:r.folderPreviewDepth,r.folderPreviewDepth)};if(fn(hc,String(i.refreshIntervalSec)),fn(vc,String(i.folderPreviewDepth)),typeof window<"u")window.dispatchEvent(new CustomEvent(Fl,{detail:{settings:i}}));return i}var Fl="piclaw:workspace-client-settings-updated",hc="workspaceRefreshIntervalSec",vc="workspaceFolderPreviewDepth",Vi=60,Pi=3;var zc=()=>{};var Bc={};_n(Bc,{WorkspaceSection:()=>Bl});function Fc(n={}){let r=n.workspaceSettings||{};return{webTerminalEnabled:r.webTerminalEnabled!==!1,vncAllowDirect:r.vncAllowDirect!==!1,treeMaxDepth:r.treeMaxDepth??4,treeMaxEntries:r.treeMaxEntries??5000}}function Bl({settingsData:n,setStatus:r,mergeSettingsData:i}){let[_,c]=w(!0),[u,f]=w(!0),[o,s]=w(4),[$,b]=w(5000),[g,p]=w(60),[h,v]=w(3),[F,y]=w(!1),[K,W]=w(!1),N=Z(""),B=Z(null),U=Z(null),z=Z(null),j=Z(!0);P(()=>{return j.current=!0,()=>{if(j.current=!1,B.current)clearTimeout(B.current);if(U.current)clearTimeout(U.current);if(z.current)clearTimeout(z.current)}},[]);let X=T((k)=>{let x=Fc(k),L=Xi();c(x.webTerminalEnabled),f(x.vncAllowDirect),s(x.treeMaxDepth),b(x.treeMaxEntries),p(L.refreshIntervalSec),v(L.folderPreviewDepth),N.current=JSON.stringify(x)},[]);P(()=>{X(n||{})},[n,X]);let t=D(()=>JSON.stringify(Fc({workspaceSettings:{webTerminalEnabled:_,vncAllowDirect:u,treeMaxDepth:o,treeMaxEntries:$}})),[_,u,o,$]);P(()=>{if(t===N.current)return;if(B.current)clearTimeout(B.current);return B.current=setTimeout(async()=>{if(!j.current)return;let k=document.activeElement;if(k&&k.closest?.(".settings-number-stepper"))return;try{let x=await Fi(JSON.parse(t));if(!j.current||!x?.ok||!x?.settings)return;if(N.current=t,i?.({workspaceSettings:x.settings}),r?.(null),y(!0),U.current)clearTimeout(U.current);U.current=setTimeout(()=>{if(j.current)y(!1)},4000)}catch(x){r?.(String(x?.message||x),"error")}},800),()=>{if(B.current)clearTimeout(B.current)}},[t,i,r]);let H=T((k)=>{let x=Kc(k);if(p(x.refreshIntervalSec),v(x.folderPreviewDepth),W(!0),z.current)clearTimeout(z.current);z.current=setTimeout(()=>{if(j.current)W(!1)},3000)},[]);return l`
        <div class="settings-section">
            ${F&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Workspace settings applied. Server-side limits affect new workspace requests immediately.
                </div>
            `}
            ${K&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Browser workspace settings applied immediately in this tab.
                </div>
            `}

            <h3>Access</h3>
            <div class="settings-row">
                <label>Enable web terminal</label>
                <input type="checkbox" checked=${_} onChange=${(k)=>c(k.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Allow direct VNC targets</label>
                <input type="checkbox" checked=${u} onChange=${(k)=>f(k.target.checked)} />
            </div>
            <p class="settings-hint">Terminal access updates immediately. Direct VNC target policy applies to new VNC requests.</p>

            <h3 style="margin-top:20px">Server scan guardrails</h3>
            <div class="settings-row">
                <label>Max tree depth</label>
                <${e}
                    label="workspace tree max depth"
                    value=${o}
                    min=${1}
                    max=${8}
                    fallback=${4}
                    width="80px"
                    onChange=${s}
                />
                <span class="settings-hint" style="margin:0">caps all <code>/workspace/tree</code> requests</span>
            </div>
            <div class="settings-row">
                <label>Max entries per scan</label>
                <${e}
                    label="workspace tree max entries"
                    value=${$}
                    min=${250}
                    max=${5000}
                    step=${250}
                    fallback=${5000}
                    width="92px"
                    onChange=${b}
                />
                <span class="settings-hint" style="margin:0">truncate oversized tree walks earlier</span>
            </div>

            <h3 style="margin-top:20px">This browser</h3>
            <div class="settings-row">
                <label>Refresh interval (seconds)</label>
                <${e}
                    label="workspace refresh interval"
                    value=${g}
                    min=${15}
                    max=${300}
                    step=${15}
                    fallback=${60}
                    width="92px"
                    onChange=${(k)=>H({refreshIntervalSec:k})}
                />
            </div>
            <div class="settings-row">
                <label>Folder preview scan depth</label>
                <${e}
                    label="folder preview scan depth"
                    value=${h}
                    min=${0}
                    max=${8}
                    fallback=${3}
                    width="80px"
                    onChange=${(k)=>H({folderPreviewDepth:k})}
                />
                <span class="settings-hint" style="margin:0">set to <code>0</code> to disable folder size preview scans</span>
            </div>
            <p class="settings-hint">Root and folder-expansion tree loads remain shallow; the folder size preview is the deepest workspace scan in the UI.</p>
        </div>
    `}var kc=Y(()=>{m();Kn();zc();Cn()});var Wc={};_n(Wc,{EnvironmentSection:()=>kl});function Qi(n={}){let r=n.environmentSettings||n.settings||n.environment||{};return{variables:Array.isArray(r.variables)?r.variables:[],overrides:r.overrides&&typeof r.overrides==="object"?r.overrides:{},count:Number(r.count||0),overrideCount:Number(r.overrideCount||0),keychainEnvNames:Array.isArray(r.keychainEnvNames)?r.keychainEnvNames:[]}}function kl({settingsData:n,filter:r="",setStatus:i,mergeSettingsData:_}){let[c,u]=w(()=>Qi(n||{})),[f,o]=w({}),[s,$]=w(""),[b,g]=w(""),[p,h]=w(null);P(()=>{u(Qi(n||{})),o({})},[n]);let v=T((B)=>{let U=Qi({environmentSettings:B?.settings||B});return u(U),_?.({environmentSettings:U}),o({}),U},[_]),F=T(async()=>{try{let B=await Bi();if(B?.ok)v(B.settings);i?.("Environment refreshed.","info")}catch(B){i?.(String(B?.message||B),"error")}},[v,i]),y=T(async(B,U)=>{let z=String(B||"").trim();if(!z)return;h(z);try{let j=await Ur({action:"set",name:z,value:String(U??"")});if(j?.ok)v(j.settings);if(i?.(`Saved environment override for ${z}.`,"info"),z===s.trim())$(""),g("")}catch(j){i?.(String(j?.message||j),"error")}finally{h(null)}},[v,s,i]),K=T(async(B)=>{let U=String(B||"").trim();if(!U)return;h(U);try{let z=await Ur({action:"clear",name:U});if(z?.ok)v(z.settings);i?.(`Cleared environment override for ${U}.`,"info")}catch(z){i?.(String(z?.message||z),"error")}finally{h(null)}},[v,i]),W=D(()=>{let B=String(r||"").trim().toLowerCase(),U=Array.isArray(c.variables)?c.variables:[];if(!B)return U;return U.filter((z)=>{return`${z?.name||""} ${z?.value||""} ${z?.source||""}`.toLowerCase().includes(B)})},[c.variables,r]),N=T((B,U)=>{o((z)=>({...z||{},[B]:U}))},[]);return l`
        <div class="settings-section">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:12px;">
                <div>
                    <h3 style="margin-top:0">Environment</h3>
                    <p class="settings-hint" style="margin-top:4px">
                        Showing non-keychain environment variables only. Overrides are stored in extension KV and applied to <code>process.env</code>, so subsequent tool calls inherit them.
                    </p>
                </div>
                <button type="button" class="settings-secondary-btn" onClick=${F}>Refresh</button>
            </div>

            <div class="settings-row" style="align-items:flex-start; gap:10px;">
                <label>Add override</label>
                <div style="display:grid; grid-template-columns:minmax(180px, 0.7fr) minmax(240px, 1fr) auto; gap:8px; flex:1;">
                    <input
                        type="text"
                        value=${s}
                        placeholder="VARIABLE_NAME"
                        spellcheck="false"
                        onInput=${(B)=>$(B.target.value)}
                    />
                    <input
                        type="text"
                        value=${b}
                        placeholder="value"
                        spellcheck="false"
                        onInput=${(B)=>g(B.target.value)}
                    />
                    <button
                        type="button"
                        disabled=${!s.trim()||p===s.trim()}
                        onClick=${()=>y(s,b)}
                    >Save</button>
                </div>
            </div>

            <p class="settings-hint">
                ${c.count} variables visible • ${c.overrideCount} overrides active • ${c.keychainEnvNames.length} keychain-injected variables hidden
            </p>

            <div class="settings-tool-list" style="max-height:58vh; overflow:auto;">
                ${W.map((B)=>{let U=String(B?.name||""),z=Object.prototype.hasOwnProperty.call(f,U)?f[U]:B.value,j=z!==B.value,X=p===U;return l`
                        <div class="settings-tool-row" key=${U} style="grid-template-columns:minmax(180px,0.45fr) minmax(240px,1fr) auto auto; align-items:center;">
                            <span class="settings-tool-name" title=${U}>${U}</span>
                            <input
                                type="text"
                                value=${z}
                                spellcheck="false"
                                onInput=${(t)=>N(U,t.target.value)}
                                style="min-width:0; width:100%; font-family:var(--font-mono, monospace);"
                            />
                            <span class="settings-tool-kind" title=${B.overridden?"Overridden in KV":"Inherited from process environment"}>
                                ${B.overridden?"override":"process"}
                            </span>
                            <span style="display:flex; gap:6px; justify-content:flex-end;">
                                <button type="button" disabled=${X||!j} onClick=${()=>y(U,z)}>Save</button>
                                <button type="button" disabled=${X||!B.overridden} onClick=${()=>K(U)}>Clear</button>
                            </span>
                        </div>
                    `})}
                ${W.length===0&&l`<p class="settings-hint">No environment variables match "${r}".</p>`}
            </div>
        </div>
    `}var jc=Y(()=>{m();Kn()});var Rc={};_n(Rc,{ProvidersSection:()=>jl});function Wl(n){switch(n){case"oauth":return"OAuth";case"api_key":return"API key";case"custom":return"Configured";default:return"Configured"}}function jl({providers:n,setStatus:r}){let[i,_]=w(null),[c,u]=w(null),[f,o]=w({}),s=T((y,K)=>{o((W)=>({...W,[y]:K}))},[]),$=T(async(y)=>{let K=(f.apiKey||"").trim();if(!K){r?.("API key cannot be empty.","error");return}_(y),r?.(`Configuring ${y}…`,"info");try{let W=JSON.stringify({provider:y,method:"api_key",api_key:K}),N=await pn("default",`/login __step2 ${W}`,null,[]);if(N?.command?.status==="error"){r?.(N.command.message,"error");return}r?.(N?.command?.message||`${y} configured.`,"success"),u(null),o({})}catch(W){r?.(String(W.message||W),"error")}finally{_(null)}},[f,r]),b=T(async(y,K)=>{_(y),r?.(`Configuring ${y}…`,"info");try{let W={provider:y,method:"custom"};for(let U of K.customFields||[])W[U.key]=(f[U.key]||"").trim();let N=JSON.stringify(W),B=await pn("default",`/login __step2 ${N}`,null,[]);if(B?.command?.status==="error"){r?.(B.command.message,"error");return}r?.(B?.command?.message||`${y} configured.`,"success"),u(null),o({})}catch(W){r?.(String(W.message||W),"error")}finally{_(null)}},[f,r]),g=T(async(y)=>{_(y),r?.(`Starting OAuth for ${y}…`,"info");try{let K=JSON.stringify({provider:y}),N=(await pn("default",`/login __step1 ${K}`,null,[]))?.command?.message||"";if(N.includes("http")){let B=N.match(/(https?:\/\/[^\s)]+)/);if(B)window.open(B[1],"_blank","noopener"),r?.("OAuth window opened. Complete the sign-in flow, then close this message.","success");else r?.(N,"success")}else r?.(N||`OAuth flow started for ${y}. Check the chat.`,"success")}catch(K){r?.(String(K.message||K),"error")}finally{_(null)}},[r]),p=T(async(y)=>{if(i)return;_(y),r?.(`Logging out ${y}…`,"info");try{await pn("default",`/logout ${y}`,null,[]),r?.(`Logged out ${y}. Restart may be needed.`,"success")}catch(K){r?.(String(K.message||K),"error")}finally{_(null)}},[i,r]),h=n||[],v=(y)=>c===y,F=(y)=>{u((K)=>K===y?null:y),o({})};return l`
        <div class="settings-section">
            <h3>Providers</h3>
            <div class="settings-provider-list">
                ${h.map((y)=>l`
                    <div class=${`settings-provider-card${y.configured?" configured":""}`}>
                        <div class="settings-provider-card-header" onClick=${()=>!y.configured&&F(y.id)}>
                            <div class="settings-provider-card-title">
                                <strong>${y.name}</strong>
                                <span class="settings-provider-id">${y.id}</span>
                                ${y.configured&&l`<span class="settings-tag settings-tag-skill">${Wl(y.authType)}</span>`}
                            </div>
                            <div class="settings-provider-card-meta">
                                ${y.hasOAuth&&l`<span class="settings-tag">OAuth</span>`}
                                ${y.hasApiKey&&l`<span class="settings-tag">API Key</span>`}
                                ${y.isCustom&&l`<span class="settings-tag">Custom</span>`}
                            </div>
                            <div class="settings-provider-card-actions">
                                ${y.configured?l`
                                    <button class="settings-addon-btn settings-addon-btn-remove"
                                        disabled=${i===y.id} onClick=${(K)=>{K.stopPropagation(),p(y.id)}}
                                    >${i===y.id?"…":"Logout"}</button>
                                    <button class="settings-addon-btn"
                                        disabled=${i===y.id} onClick=${(K)=>{K.stopPropagation(),F(y.id)}}
                                    >Reconfigure</button>
                                `:l`
                                    <button class="settings-addon-btn settings-addon-btn-install"
                                        disabled=${i===y.id} onClick=${(K)=>{K.stopPropagation(),F(y.id)}}
                                    >Set up</button>
                                `}
                            </div>
                        </div>

                        ${v(y.id)&&l`
                            <div class="settings-provider-setup">
                                <p class="settings-hint settings-provider-setup-hint">Sign-in flows open in the browser. In narrow panes the setup form stacks vertically to avoid clipping.</p>
                                ${y.hasOAuth&&l`
                                    <div class="settings-provider-method">
                                        <button class="settings-addon-btn settings-addon-btn-install"
                                            disabled=${i===y.id}
                                            onClick=${()=>g(y.id)}>
                                            ${i===y.id?"Starting…":"Sign in with OAuth"}
                                        </button>
                                    </div>
                                `}
                                ${y.hasApiKey&&l`
                                    <div class="settings-provider-method">
                                        <div class="settings-provider-field-row">
                                            <label>API Key</label>
                                            <input type="password" value=${f.apiKey||""}
                                                onInput=${(K)=>s("apiKey",K.target.value)}
                                                placeholder=${y.apiKeyHint||"Enter API key"} />
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${i===y.id||!(f.apiKey||"").trim()}
                                                onClick=${()=>$(y.id)}>
                                                ${i===y.id?"…":"Save"}
                                            </button>
                                        </div>
                                    </div>
                                `}
                                ${y.isCustom&&l`
                                    <div class="settings-provider-method">
                                        ${(y.customFields||[]).map((K)=>l`
                                            <div class="settings-provider-field-row">
                                                <label>${K.label}${K.required?" *":""}</label>
                                                <input type="text" value=${f[K.key]||""}
                                                    onInput=${(W)=>s(K.key,W.target.value)}
                                                    placeholder=${K.placeholder||""} />
                                            </div>
                                        `)}
                                        <div class="settings-provider-form-actions">
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${i===y.id}
                                                onClick=${()=>b(y.id,y)}>
                                                ${i===y.id?"Configuring…":"Save configuration"}
                                            </button>
                                        </div>
                                    </div>
                                `}
                            </div>
                        `}
                    </div>
                `)}
            </div>
        </div>
    `}var Tc=Y(()=>{m();Kn()});var Uc={};_n(Uc,{ModelsSection:()=>Ll});function Ul(n){return typeof n==="string"&&n.toLowerCase()==="anthropic"}function Hl({thinkingLevel:n,supportsThinking:r,provider:i,availableLevels:_,onSetLevel:c,disabled:u}){let f=Ul(i)?Rl:Tl,o=_&&_.length>1?_:["off","minimal","low","medium","high"],s=Math.max(0,o.indexOf(n??"off"));if(!r)return l`<div class="settings-thinking-slider"><label>Thinking level</label><p class="settings-hint" style="margin:4px 0 0">Current model does not support thinking.</p></div>`;return l`
        <div class="settings-thinking-slider">
            <label>Thinking level: <strong>${f[o[s]]||o[s]}</strong></label>
            <div class="settings-slider-track">
                <input type="range" min="0" max=${o.length-1} step="1" value=${s} disabled=${u}
                    onInput=${($)=>c(o[parseInt($.target.value,10)])} />
                <div class="settings-slider-labels">
                    ${o.map(($,b)=>l`<span class=${b===s?"active":""} onClick=${()=>!u&&c($)}>${f[$]||$}</span>`)}
                </div>
            </div>
        </div>
    `}function Ll({filter:n=""}){let[r,i]=w(null),[_,c]=w(!1),[u,f]=w("off"),[o,s]=w(!1),[$,b]=w(["off"]),[g,p]=w(!1),[h,v]=w(!1),[F,y]=w(!1),K=T(async()=>{let k=await ki();if(i(k),k.thinking_level)f(k.thinking_level);if(s(Boolean(k.supports_thinking)),p(Boolean(k.scoped_models_only)),Array.isArray(k.available_thinking_levels)&&k.available_thinking_levels.length>0)b(k.available_thinking_levels);return k},[]);P(()=>{K().catch((k)=>{console.warn("[settings/models] Failed to load models.",k),i({models:[],model_options:[]})})},[]);let W=T(async(k)=>{if(_)return;c(!0);try{await pn("default",`/model ${k}`,null,[]),await K()}catch(x){console.error("Failed to switch model:",x)}finally{c(!1)}},[_,K]),N=T(async(k)=>{if(h)return;v(!0),p(Boolean(k));try{let x=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scopedModelsOnly:Boolean(k)})}),L=await x.json().catch(()=>({}));if(!x.ok||!L?.ok)throw Error(L?.error||"Failed to save scoped model setting.");await K()}catch(x){console.error("Failed to set scoped model filtering:",x),await K().catch((L)=>{console.warn("[settings/models] Reload after scoped model filtering failure failed.",L)})}finally{v(!1)}},[h,K]),B=T(async(k)=>{if(F)return;y(!0),f(k);try{let x=await pn("default",`/thinking ${k}`,null,[]);if(x?.command?.thinking_level)f(x.command.thinking_level);s(x?.command?.supports_thinking!==!1),await K()}catch(x){console.error("Failed to set thinking:",x),await K().catch((L)=>{console.warn("[settings/models] Reload after thinking change failure failed.",L)})}finally{y(!1)}},[F,K]);if(!r)return l`<div class="settings-loading">Loading models\u2026</div>`;let U=r.model_options||[],z=r.current,X=U.find((k)=>k.label===z)?.provider||"",t=n.toLowerCase(),H=t?U.filter((k)=>k.label.toLowerCase().includes(t)||(k.provider||"").toLowerCase().includes(t)):U;return l`
        <div class="settings-models-split">
            <div class="settings-models-summary settings-hint">Model and provider names may wrap in narrow panes to avoid clipping.</div>
            <div class="settings-row" style="padding:0 0 10px 0; align-items:flex-start">
                <label>Scoped models only</label>
                <div style="display:flex; flex-direction:column; gap:4px; min-width:0">
                    <label style="display:flex; align-items:center; gap:8px; font-weight:500">
                        <input type="checkbox" checked=${g} disabled=${h} onChange=${(k)=>N(k.target.checked)} />
                        Use Pi <code>enabledModels</code> for Piclaw model lists
                    </label>
                    <span class="settings-hint" style="margin:0">
                        Filters this picker and the <code>list_models</code> tool. TUI model selection remains unchanged.
                    </span>
                </div>
            </div>
            <div class="settings-models-list">
                <table class="settings-table settings-borderless settings-models-table">
                    <thead><tr><th style="width:32px"></th><th>Model</th><th>Provider</th><th>Context</th><th style="text-align:center">Reasoning</th></tr></thead>
                    <tbody>
                        ${H.map((k)=>l`
                            <tr class=${k.label===z?"settings-row-active":""}>
                                <td><input type="radio" name="settings-model" checked=${k.label===z} disabled=${_} onChange=${()=>W(k.label)} /></td>
                                <td>${k.name||k.label}</td><td>${k.provider}</td>
                                <td>${k.context_window?(k.context_window/1000).toFixed(0)+"K":"—"}</td>
                                <td style="text-align:center">${k.reasoning?"\uD83E\uDDE0":"—"}</td>
                            </tr>
                        `)}
                        ${H.length===0&&l`<tr><td colspan="5" class="settings-empty">No models match "${n}"</td></tr>`}
                    </tbody>
                </table>
            </div>
            <div class="settings-models-footer">
                <${Hl}
                    thinkingLevel=${u}
                    supportsThinking=${o}
                    provider=${X}
                    availableLevels=${$}
                    onSetLevel=${B}
                    disabled=${F||_} />
            </div>
        </div>
    `}var Rl,Tl;var Hc=Y(()=>{m();Kn();Rl={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"max"},Tl={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"xhigh"}});function qi(n){let r=String(n||"").trim().toLowerCase();if(!r)return"default";if(r==="solarized-dark"||r==="solarized-light")return"solarized";if(r==="github-dark"||r==="github-light")return"github";if(r==="tokyo-night")return"tokyo";return r}function Vc(n){if(!n)return null;let r=String(n).trim();if(!r)return null;let i=r.startsWith("#")?r.slice(1):r;if(!/^[0-9a-fA-F]{3}$/.test(i)&&!/^[0-9a-fA-F]{6}$/.test(i))return null;let _=i.length===3?i.split("").map((u)=>u+u).join(""):i,c=parseInt(_,16);return{r:c>>16&255,g:c>>8&255,b:c&255,hex:`#${_.toLowerCase()}`}}function Gl(n,r){try{if(document.body){n.style.display="none",document.body.appendChild(n);let i=getComputedStyle(n).color||n.style.color;return document.body.removeChild(n),i}}catch{return r}return r}function Vl(n){if(!n||typeof document>"u")return null;let r=String(n).trim();if(!r)return null;let i=document.createElement("div");if(i.style.color="",i.style.color=r,!i.style.color)return null;let c=Gl(i,i.style.color).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!c)return null;let u=parseInt(c[1],10),f=parseInt(c[2],10),o=parseInt(c[3],10);if(![u,f,o].every(($)=>Number.isFinite($)))return null;let s=`#${[u,f,o].map(($)=>$.toString(16).padStart(2,"0")).join("")}`;return{r:u,g:f,b:o,hex:s}}function Gn(n){return Vc(n)||Vl(n)}function Di(n,r,i){let _=Math.round(n.r+(r.r-n.r)*i),c=Math.round(n.g+(r.g-n.g)*i),u=Math.round(n.b+(r.b-n.b)*i);return`rgb(${_} ${c} ${u})`}function Pr(n,r){return`rgba(${n.r}, ${n.g}, ${n.b}, ${r})`}function Pl(n){let r=n.r/255,i=n.g/255,_=n.b/255,c=r<=0.03928?r/12.92:Math.pow((r+0.055)/1.055,2.4),u=i<=0.03928?i/12.92:Math.pow((i+0.055)/1.055,2.4),f=_<=0.03928?_/12.92:Math.pow((_+0.055)/1.055,2.4);return 0.2126*c+0.7152*u+0.0722*f}function Xl(n){return Pl(n)>0.4?"#000000":"#ffffff"}function Pc(){if(typeof window>"u")return"light";try{return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch{return"light"}}function Zi(n){return Lc[n]||Lc.default}function Ql(n){return n.mode==="auto"?Pc():n.mode}function Xc(n,r){let i=Zi(n);if(r==="dark"&&i.dark)return i.dark;if(r==="light"&&i.light)return i.light;return i.dark||i.light||Fn}function zn(n,r,i){let _=Gn(n);if(!_)return n;return Di(_,r,i)}function Qc(n,r,i){let _=Gn(r);if(!_)return n;let u=Vc(i==="dark"?"#ffffff":"#000000");return{...n,bgPrimary:zn(n.bgPrimary,_,0.08),bgSecondary:zn(n.bgSecondary,_,0.12),bgHover:zn(n.bgHover,_,0.16),textPrimary:zn(n.textPrimary,_,i==="dark"?0.08:0.06),textSecondary:zn(n.textSecondary,_,i==="dark"?0.12:0.1),borderColor:zn(n.borderColor,_,0.1),accent:_.hex,accentHover:u?Di(_,u,0.18):_.hex,warning:zn(n.warning||Fn.warning,_,0.14),danger:zn(n.danger,_,0.16),success:zn(n.success,_,0.16)}}function Al(n,r){let i=Gn(n?.warning);if(i)return i.hex;let _=Gn(r==="dark"?Ar.warning:Fn.warning)||Gn(Fn.warning),c=Gn(n?.accent);if(_&&c)return Di(_,c,r==="dark"?0.18:0.14);return r==="dark"?Ar.warning:Fn.warning}function Ml(n,r){if(typeof document>"u")return;let i=document.documentElement,_=n.accent,c=Gn(_),u=c?Pr(c,r==="dark"?0.35:0.2):n.searchHighlight||n.searchHighlightColor,f=c?Pr(c,r==="dark"?0.16:0.12):"rgba(29, 155, 240, 0.12)",o=c?Pr(c,r==="dark"?0.28:0.2):"rgba(29, 155, 240, 0.2)",s=c?Xl(c):r==="dark"?"#000000":"#ffffff",$=c?Pr(c,r==="dark"?0.35:0.25):"rgba(29, 155, 240, 0.25)",b=Al(n,r),g={"--bg-primary":n.bgPrimary,"--bg-secondary":n.bgSecondary,"--bg-hover":n.bgHover,"--text-primary":n.textPrimary,"--text-secondary":n.textSecondary,"--border-color":n.borderColor,"--accent-color":_,"--accent-hover":n.accentHover||_,"--accent-color-alpha":$,"--accent-soft":f,"--accent-soft-strong":o,"--accent-contrast-text":s,"--warning-color":b,"--danger-color":n.danger||Fn.danger,"--success-color":n.success||Fn.success,"--search-highlight-color":u||"rgba(29, 155, 240, 0.2)"};Object.entries(g).forEach(([p,h])=>{if(h)i.style.setProperty(p,h)})}function ql(){if(typeof document>"u")return;let n=document.documentElement;Nl.forEach((r)=>n.style.removeProperty(r))}function Jn(n,r={}){if(typeof document>"u")return null;let i=typeof r.id==="string"&&r.id.trim()?r.id.trim():null,_=i?document.getElementById(i):document.querySelector(`meta[name="${n}"]`);if(!_)_=document.createElement("meta"),document.head.appendChild(_);if(_.setAttribute("name",n),i)_.setAttribute("id",i);return _}function Nc(n){let r=qi(Vn?.theme||"default"),i=Vn?.tint?String(Vn.tint).trim():null,_=Xc(r,n);if(r==="default"&&i)_=Qc(_,i,n);if(_?.bgPrimary)return _.bgPrimary;return n==="dark"?Ar.bgPrimary:Fn.bgPrimary}function Dl(n,r){if(typeof document>"u")return;let i=Jn("theme-color",{id:"dynamic-theme-color"});if(i&&n)i.removeAttribute("media"),i.setAttribute("content",n);let _=Jn("theme-color",{id:"theme-color-light"});if(_)_.setAttribute("media","(prefers-color-scheme: light)"),_.setAttribute("content",Nc("light"));let c=Jn("theme-color",{id:"theme-color-dark"});if(c)c.setAttribute("media","(prefers-color-scheme: dark)"),c.setAttribute("content",Nc("dark"));let u=Jn("msapplication-TileColor");if(u&&n)u.setAttribute("content",n);let f=Jn("msapplication-navbutton-color");if(f&&n)f.setAttribute("content",n);let o=Jn("apple-mobile-web-app-status-bar-style");if(o)o.setAttribute("content",r==="dark"?"black-translucent":"default")}function Zl(){if(typeof window>"u")return;let n={...Vn,mode:Gc};window.dispatchEvent(new CustomEvent("piclaw-theme-change",{detail:n}))}function Il(){if(typeof window>"u")return"web:default";try{let r=new URL(window.location.href).searchParams.get("chat_jid");return r&&r.trim()?r.trim():"web:default"}catch{return"web:default"}}function Yl(n){if(typeof document>"u"||!n)return;let r=document.documentElement;if(r?.style)r.style.background=n;if(document.body?.style)document.body.style.background=n}function Ii(n,r={}){if(typeof window>"u"||typeof document>"u")return;let i=qi(n?.theme||"default"),_=n?.tint?String(n.tint).trim():null,c=Zi(i),u=Ql(c),f=Xc(i,u);Vn={theme:i,tint:_},Gc=u;let o=document.documentElement;o.dataset.theme=u,o.dataset.colorTheme=i,o.dataset.tint=_?String(_):"",o.style.colorScheme=u;let s=f;if(i==="default"&&_)s=Qc(f,_,u);if(i==="default"&&!_)ql();else Ml(s,u);if(Yl(s.bgPrimary),Dl(s.bgPrimary,u),Zl(),r.persist!==!1)if(fn(Mi,i),_)fn(Qr,_);else fn(Qr,"")}function Xr(){if(Zi(Vn.theme).mode!=="auto")return;Ii(Vn,{persist:!1})}function Cl(){if(typeof window>"u")return;let n=qi(In(Mi)||"default"),r=(()=>{let i=In(Qr);return i?i.trim():null})();Ii({theme:n,tint:r},{persist:!1})}function mo(){if(typeof window>"u")return()=>{};if(Cl(),window.matchMedia&&!Ai){let n=window.matchMedia("(prefers-color-scheme: dark)");if(n.addEventListener)n.addEventListener("change",Xr);else if(n.addListener)n.addListener(Xr);return Ai=!0,()=>{if(n.removeEventListener)n.removeEventListener("change",Xr);else if(n.removeListener)n.removeListener(Xr);Ai=!1}}return()=>{}}function Yi(n){if(!n||typeof n!=="object")return;let r=Il(),i=n.chat_jid||n.chatJid||null,_=n.theme??n.name??n.colorTheme,c=n.tint??null;if(!i||i===r)Ii({theme:_||"default",tint:c},{persist:!1});fn(Mi,_||"default"),fn(Qr,c||"")}function ao(){if(typeof document>"u")return"light";let n=document.documentElement?.dataset?.theme;if(n==="dark"||n==="light")return n;return Pc()}var Mi="piclaw_theme",Qr="piclaw_tint",Fn,Ar,Lc,Nl,Vn,Gc="light",Ai=!1;var Ac=Y(()=>{Fn={bgPrimary:"#ffffff",bgSecondary:"#f7f9fa",bgHover:"#e8ebed",textPrimary:"#0f1419",textSecondary:"#536471",borderColor:"#eff3f4",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},Ar={bgPrimary:"#000000",bgSecondary:"#16181c",bgHover:"#1d1f23",textPrimary:"#e7e9ea",textSecondary:"#71767b",borderColor:"#2f3336",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},Lc={default:{label:"Default",mode:"auto",light:Fn,dark:Ar},tango:{label:"Tango",mode:"light",light:{bgPrimary:"#f6f5f4",bgSecondary:"#efedeb",bgHover:"#e5e3e1",textPrimary:"#2e3436",textSecondary:"#5c6466",borderColor:"#d3d7cf",accent:"#3465a4",accentHover:"#2c5890",danger:"#cc0000",success:"#4e9a06"}},xterm:{label:"XTerm",mode:"dark",dark:{bgPrimary:"#000000",bgSecondary:"#0a0a0a",bgHover:"#121212",textPrimary:"#d0d0d0",textSecondary:"#8a8a8a",borderColor:"#1f1f1f",accent:"#00a2ff",accentHover:"#0086d1",danger:"#ff5f5f",success:"#5fff87"}},monokai:{label:"Monokai",mode:"dark",dark:{bgPrimary:"#272822",bgSecondary:"#2f2f2f",bgHover:"#3a3a3a",textPrimary:"#f8f8f2",textSecondary:"#cfcfc2",borderColor:"#3e3d32",accent:"#f92672",accentHover:"#e81560",danger:"#f92672",success:"#a6e22e"}},"monokai-pro":{label:"Monokai Pro",mode:"dark",dark:{bgPrimary:"#2d2a2e",bgSecondary:"#363237",bgHover:"#403a40",textPrimary:"#fcfcfa",textSecondary:"#c1c0c0",borderColor:"#444046",accent:"#ff6188",accentHover:"#f74f7e",danger:"#ff4f5e",success:"#a9dc76"}},ristretto:{label:"Ristretto",mode:"dark",dark:{bgPrimary:"#2c2525",bgSecondary:"#362d2d",bgHover:"#403535",textPrimary:"#f4f1ef",textSecondary:"#cbbdb8",borderColor:"#4a3c3c",accent:"#ff9f43",accentHover:"#f28a2e",danger:"#ff5f56",success:"#a9dc76"}},dracula:{label:"Dracula",mode:"dark",dark:{bgPrimary:"#282a36",bgSecondary:"#303445",bgHover:"#3a3f52",textPrimary:"#f8f8f2",textSecondary:"#c5c8d6",borderColor:"#44475a",accent:"#bd93f9",accentHover:"#a87ded",danger:"#ff5555",success:"#50fa7b"}},catppuccin:{label:"Catppuccin",mode:"dark",dark:{bgPrimary:"#1e1e2e",bgSecondary:"#24273a",bgHover:"#2c2f41",textPrimary:"#cdd6f4",textSecondary:"#a6adc8",borderColor:"#313244",accent:"#89b4fa",accentHover:"#74a0f5",danger:"#f38ba8",success:"#a6e3a1"}},nord:{label:"Nord",mode:"dark",dark:{bgPrimary:"#2e3440",bgSecondary:"#3b4252",bgHover:"#434c5e",textPrimary:"#eceff4",textSecondary:"#d8dee9",borderColor:"#4c566a",accent:"#88c0d0",accentHover:"#78a9c0",danger:"#bf616a",success:"#a3be8c"}},gruvbox:{label:"Gruvbox",mode:"dark",dark:{bgPrimary:"#282828",bgSecondary:"#32302f",bgHover:"#3c3836",textPrimary:"#ebdbb2",textSecondary:"#bdae93",borderColor:"#3c3836",accent:"#d79921",accentHover:"#c28515",danger:"#fb4934",success:"#b8bb26"}},solarized:{label:"Solarized",mode:"auto",light:{bgPrimary:"#fdf6e3",bgSecondary:"#f5efdc",bgHover:"#eee8d5",textPrimary:"#586e75",textSecondary:"#657b83",borderColor:"#e0d8c6",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"},dark:{bgPrimary:"#002b36",bgSecondary:"#073642",bgHover:"#0b3c4a",textPrimary:"#eee8d5",textSecondary:"#93a1a1",borderColor:"#18424a",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"}},tokyo:{label:"Tokyo",mode:"dark",dark:{bgPrimary:"#1a1b26",bgSecondary:"#24283b",bgHover:"#2f3549",textPrimary:"#c0caf5",textSecondary:"#9aa5ce",borderColor:"#414868",accent:"#7aa2f7",accentHover:"#6b92e6",danger:"#f7768e",success:"#9ece6a"}},miasma:{label:"Miasma",mode:"dark",dark:{bgPrimary:"#1f1f23",bgSecondary:"#29292f",bgHover:"#33333a",textPrimary:"#e5e5e5",textSecondary:"#b4b4b4",borderColor:"#3d3d45",accent:"#c9739c",accentHover:"#b8618c",danger:"#e06c75",success:"#98c379"}},github:{label:"GitHub",mode:"auto",light:{bgPrimary:"#ffffff",bgSecondary:"#f6f8fa",bgHover:"#eaeef2",textPrimary:"#24292f",textSecondary:"#57606a",borderColor:"#d0d7de",accent:"#0969da",accentHover:"#0550ae",danger:"#cf222e",success:"#1a7f37"},dark:{bgPrimary:"#0d1117",bgSecondary:"#161b22",bgHover:"#21262d",textPrimary:"#c9d1d9",textSecondary:"#8b949e",borderColor:"#30363d",accent:"#2f81f7",accentHover:"#1f6feb",danger:"#f85149",success:"#3fb950"}},gotham:{label:"Gotham",mode:"dark",dark:{bgPrimary:"#0b0f14",bgSecondary:"#111720",bgHover:"#18212b",textPrimary:"#cbd6e2",textSecondary:"#9bb0c3",borderColor:"#1f2a37",accent:"#5ccfe6",accentHover:"#48b8ce",danger:"#d26937",success:"#2aa889"}}},Nl=["--bg-primary","--bg-secondary","--bg-hover","--text-primary","--text-secondary","--border-color","--accent-color","--accent-hover","--accent-color-alpha","--accent-contrast-text","--accent-soft","--accent-soft-strong","--warning-color","--danger-color","--success-color","--search-highlight-color"],Vn={theme:"default",tint:null}});var qc={};_n(qc,{ThemeSection:()=>Ol});function Mc(n={}){return{uiTheme:typeof n.uiTheme==="string"&&n.uiTheme.trim()?n.uiTheme.trim():"default",uiTint:typeof n.uiTint==="string"&&n.uiTint.trim()?n.uiTint.trim():""}}function Ol({themes:n,colorKeys:r,settingsData:i,setStatus:_,mergeSettingsData:c}){let[u,f]=w("default"),[o,s]=w(""),[$,b]=w(!1),g=Z(""),p=Z(null),h=Z(!0);P(()=>{return h.current=!0,()=>{h.current=!1}},[]);let v=T((N)=>{let B=Mc(N);f(B.uiTheme),s(B.uiTint),g.current=JSON.stringify(B)},[]);P(()=>{if(i){v(i);return}v({uiTheme:document.documentElement.dataset.colorTheme||"default",uiTint:document.documentElement.dataset.tint||""})},[i,v]);let F=T((N,B)=>{Yi({theme:N,tint:B||null}),f(N||"default"),s(B||"")},[]),y=D(()=>JSON.stringify(Mc({uiTheme:u,uiTint:o})),[u,o]);P(()=>{if(y===g.current)return;if(p.current)clearTimeout(p.current);return p.current=setTimeout(async()=>{if(!h.current)return;b(!0);try{let N=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:y}),B=await N.json().catch(()=>({}));if(!h.current)return;if(!N.ok||!B?.ok||!B?.settings){_?.(B?.error||"Failed to save appearance settings.","error");return}g.current=y,c?.(B.settings),_?.("Appearance synced across clients.","success")}catch(N){if(!h.current)return;console.warn("[settings/appearance] Failed to persist appearance settings.",N),_?.("Failed to save appearance settings.","error")}finally{if(h.current)b(!1)}},250),()=>{if(p.current)clearTimeout(p.current)}},[y,c,_]);let K=r||[],W=n||[];return l`
        <div class="settings-section">
            ${$&&l`<div class="settings-hint" style="margin:0 0 12px 0;">Syncing appearance…</div>`}
            <div class="settings-tint-row">
                <label class="settings-tint-label">
                    <input type="radio" name="settings-theme"
                        checked=${u==="default"}
                        onChange=${()=>F("default",o)} />
                    <strong>Default</strong>
                    <span class="settings-hint" style="margin:0 0 0 6px">auto (light/dark)</span>
                </label>
                <div class="settings-tint-picker">
                    <label class="settings-hint" style="margin:0">Tint:</label>
                    <input type="color"
                        value=${o||"#1d9bf0"}
                        onInput=${(N)=>{let B=N.target.value;if(s(B),u==="default")Yi({theme:"default",tint:B})}} />
                    ${o&&l`
                        <button class="settings-tint-clear" onClick=${()=>F("default","")}
                            title="Clear tint">\u2715</button>
                    `}
                    <span class="settings-tint-hex">${o||"none"}</span>
                </div>
            </div>

            <table class="settings-table settings-borderless settings-theme-table">
                <thead>
                    <tr>
                        <th></th><th>Theme</th><th>Mode</th>
                        ${K.map((N)=>l`<th class="settings-swatch-header">${N.replace(/([A-Z])/g," $1").trim()}</th>`)}
                    </tr>
                </thead>
                <tbody>
                    ${W.filter((N)=>N.name!=="default").map((N)=>l`
                        <tr class=${N.name===u?"settings-row-active":""}
                            style="cursor:pointer" onClick=${()=>F(N.name,"")}>
                            <td><input type="radio" name="settings-theme" checked=${N.name===u} onChange=${()=>F(N.name,"")} /></td>
                            <td><strong>${N.label}</strong></td>
                            <td>${N.mode}</td>
                            ${K.map((B)=>{let U=N.colors?.[B];return l`<td class="settings-swatch-cell">
                                    ${U?l`<span class="settings-color-swatch" style=${"background:"+U} title=${U}></span>`:"—"}
                                </td>`})}
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `}var Dc=Y(()=>{m();Ac()});var Ic={};_n(Ic,{__scheduledTasksSettingsTest:()=>ml,ScheduledTasksSection:()=>el});function Pn(n){if(!n)return"—";let r=new Date(n);if(Number.isNaN(r.getTime()))return n;return r.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Zc(n){let r=Number(n);if(!Number.isFinite(r))return"—";if(r<1000)return`${Math.round(r)}ms`;return`${(r/1000).toFixed(r<1e4?1:0)}s`}function Ci(n){if(!n)return"—";if(n.schedule_type==="once")return`once · ${Pn(n.schedule_value)}`;if(n.schedule_type==="interval")return`interval · ${n.schedule_value}`;if(n.schedule_type==="cron")return`cron · ${n.schedule_value}`;return`${n.schedule_type||"schedule"} · ${n.schedule_value||"—"}`}function Oi(n){let r=n?.task_kind||"agent";return r==="internal"?"internal/protected":r}function Ji(n){return(n?.task_kind||"agent")==="internal"}function El(n){if(!n)return"";let r=String(n).replace(/\s+/g," ").trim();return r.length>180?`${r.slice(0,179)}…`:r}function En({children:n,type:r="neutral"}){return l`<span class=${`settings-task-pill settings-task-pill-${r}`}>${n}</span>`}function dl({task:n}){let r=Array.isArray(n?.recent_run_logs)?n.recent_run_logs:[];if(!r.length)return l`<p class="settings-hint">No run logs recorded yet.</p>`;return l`
        <div class="settings-task-run-list">
            ${r.map((i)=>l`
                <div class=${`settings-task-run-row settings-task-run-${i.status||"unknown"}`}>
                    <div class="settings-task-run-meta">
                        <${En} type=${i.status==="error"?"error":"success"}>${i.status||"unknown"}<//>
                        <span>${Pn(i.run_at)}</span>
                        <span>${Zc(i.duration_ms)}</span>
                    </div>
                    <div class="settings-task-run-summary">
                        ${i.error_summary||El(i.error)||i.result_summary||i.result||"No summary"}
                    </div>
                </div>
            `)}
        </div>
    `}function Sl({task:n,onAction:r}){if(!n)return l`<div class="settings-task-detail-empty">Select a task to inspect schedule, status, and run history.</div>`;let i=Ji(n);return l`
        <div class="settings-task-detail">
            <div class="settings-task-detail-header">
                <div>
                    <h4>${n.summary||n.id}</h4>
                    <code>${n.id}</code>
                </div>
                <div class="settings-task-detail-actions">
                    ${n.status==="active"&&l`<button onClick=${()=>r("pause",n)}>Pause</button>`}
                    ${n.status==="paused"&&l`<button onClick=${()=>r("resume",n)}>Resume</button>`}
                    <button class="danger" onClick=${()=>r("delete",n)}>Delete</button>
                </div>
            </div>
            <div class="settings-task-detail-grid">
                <span>Status</span><strong>${n.status||"—"}</strong>
                <span>Kind</span><strong>${Oi(n)}</strong>
                <span>Schedule</span><strong>${Ci(n)}</strong>
                <span>Next run</span><strong>${Pn(n.next_run)}</strong>
                <span>Last run</span><strong>${Pn(n.last_run)}</strong>
                <span>Last result</span><strong>${n.latest_run_log?.status||n.last_result||"—"}</strong>
                <span>Chat</span><code>${n.chat_jid||"—"}</code>
                <span>Model</span><code>${n.model||"default"}</code>
                ${n.cwd&&l`<span>CWD</span><code>${n.cwd}</code>`}
                ${n.timeout_sec&&l`<span>Timeout</span><strong>${n.timeout_sec}s</strong>`}
                ${i&&l`<span>Protection</span><strong>Internal task actions require explicit confirmation.</strong>`}
            </div>
            <div class="settings-task-command-block">
                <strong>${n.task_kind==="shell"?"Command":"Prompt"}</strong>
                <pre>${n.command||n.prompt||n.command_summary||n.prompt_summary||n.summary||"—"}</pre>
            </div>
            <h4>Recent runs</h4>
            <${dl} task=${n} />
        </div>
    `}function el({filter:n="",setStatus:r}){let[i,_]=w([]),[c,u]=w({active:0,paused:0,completed:0}),[f,o]=w("all"),[s,$]=w(""),[b,g]=w(!0),[p,h]=w(null),[v,F]=w(null),[y,K]=w(null),[W,N]=w(!1),B=T(async(t={})=>{g(!0),h(null);try{let H=await gi({status:f,chatJid:s.trim()||void 0,limit:50,includeRunLogs:!0,runLogLimit:5});_(H.tasks||[]),u(H.counts||{active:0,paused:0,completed:0});let k=t.selectedId||v,x=(H.tasks||[]).find((L)=>L.id===k)||(H.tasks||[])[0]||null;F(x?.id||null),K(x)}catch(H){h(H?.message||"Failed to load scheduled tasks.")}finally{g(!1)}},[f,s,v]);P(()=>{B()},[B]);let U=String(n||"").trim().toLowerCase(),z=D(()=>{if(!U)return i;return i.filter((t)=>[t.id,t.chat_jid,t.status,t.task_kind,t.schedule_type,t.schedule_value,t.summary,t.prompt_summary,t.command_summary,t.latest_run_log?.error_summary].some((H)=>String(H||"").toLowerCase().includes(U)))},[i,U]),j=T((t)=>{F(t?.id||null),K(t||null)},[]),X=T(async(t,H)=>{if(!H||W)return;let k=Ji(H),x=H.summary||H.command_summary||H.prompt_summary||H.id,L=t==="delete"?`Delete scheduled task ${H.id}?

${x}`:`${t==="pause"?"Pause":"Resume"} scheduled task ${H.id}?

${x}`;if(!window.confirm(L))return;if(k&&!window.confirm(`Task ${H.id} is internal/protected. Continue with ${t}?`))return;N(!0),r?.(`${t==="delete"?"Deleting":t==="pause"?"Pausing":"Resuming"} ${H.id}…`,"info");try{await $i(t,H.id,{allowInternal:k}),r?.(`Scheduled task ${H.id} ${t==="delete"?"deleted":t==="pause"?"paused":"resumed"}.`,"success"),await B({selectedId:t==="delete"?null:H.id})}catch(Q){r?.(Q?.message||`Failed to ${t} task.`,"error")}finally{N(!1)}},[W,B,r]);return l`
        <div class="settings-section settings-scheduled-tasks-section">
            <div class="settings-task-toolbar">
                <div class="settings-task-counts">
                    <${En} type="active">Active ${c.active||0}<//>
                    <${En} type="paused">Paused ${c.paused||0}<//>
                    <${En} type="completed">Completed ${c.completed||0}<//>
                </div>
                <div class="settings-task-filters">
                    <select value=${f} onChange=${(t)=>o(t.target.value)}>
                        ${Jl.map((t)=>l`<option value=${t}>${t==="all"?"All statuses":t}</option>`)}
                    </select>
                    <input type="text" placeholder="Filter chat JID…" value=${s} onInput=${(t)=>$(t.target.value)} />
                    <button onClick=${()=>B()} disabled=${b}>Refresh</button>
                </div>
            </div>

            ${b&&l`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading scheduled tasks…</span></div>`}
            ${p&&l`<div class="settings-error-state">${p}</div>`}
            ${!b&&!p&&i.length===0&&l`
                <div class="settings-empty-state">
                    <strong>No scheduled tasks found.</strong>
                    <p>Tasks created with reminders, `/i`, or the scheduler tool will appear here.</p>
                </div>
            `}
            ${!b&&!p&&i.length>0&&l`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Scheduled tasks">
                        ${z.map((t)=>l`
                            <button class=${`settings-task-row ${t.id===v?"active":""}`} onClick=${()=>j(t)}>
                                <span class="settings-task-row-main">
                                    <strong>${t.summary||t.id}</strong>
                                    <span>${Ci(t)}</span>
                                </span>
                                <span class="settings-task-row-meta">
                                    <${En} type=${t.status||"neutral"}>${t.status}<//>
                                    <${En}>${Oi(t)}<//>
                                </span>
                                <span class="settings-task-row-times">Next ${Pn(t.next_run)} · Last ${Pn(t.last_run)}${t.latest_run_log?.status?` · ${t.latest_run_log.status}`:""}</span>
                            </button>
                        `)}
                        ${z.length===0&&l`<p class="settings-hint">No tasks match “${n}”.</p>`}
                    </div>
                    <${Sl} task=${y&&z.some((t)=>t.id===y.id)?y:z[0]} onAction=${X} />
                </div>
            `}
        </div>
    `}var Jl,ml;var Yc=Y(()=>{m();Kn();Jl=["all","active","paused","completed"];ml={formatDateTime:Pn,formatDuration:Zc,labelForSchedule:Ci,kindLabel:Oi,isProtectedTask:Ji}});function Cc(n){return String(n||"").toLowerCase().replace(/^[@/]+/,"").replace(/\s+/g," ").trim()}function dn(n){return typeof n==="string"&&n.trim().length>0}function Ei(n,...r){let i=Cc(n);if(!i)return!0;let _=r.map((c)=>Cc(c)).filter(Boolean);for(let c of _)if(c.startsWith(i)||c.includes(i))return!0;return!1}function Oc(n){if(!Array.isArray(n))return null;let r=[],i=new Set;for(let _ of n){let c=String(_||"").trim();if(!c)continue;let u=c.toLowerCase();if(i.has(u))continue;i.add(u),r.push(c)}return r}function gr(n){let r=n&&typeof n==="object"?n:{};return{workspaceCommands:Oc(r.workspaceCommands),slashCommands:Oc(r.slashCommands)}}function Jc(n,r){if(!Array.isArray(n))return!0;return n.some((i)=>i.toLowerCase()===r.toLowerCase())}function al(n){let r=Array.isArray(n?.commands)?n.commands:[],i=gr(n?.settings),_=String(n?.query||"");return r.filter((c)=>Jc(i.workspaceCommands,c.id)).filter((c)=>Ei(_,c.label,c.description,...c.keywords||[])).map((c)=>({key:`workspace:${c.id}`,kind:"workspace",title:c.label,subtitle:c.description,searchText:`${c.label} ${c.description} ${(c.keywords||[]).join(" ")}`.trim(),visualHint:c.label.slice(0,1).toUpperCase()||"W",categoryLabel:"Workspace",actionHint:"Run",commandId:c.id}))}function n0(n){let r=Array.isArray(n?.agents)?n.agents:[],i=String(n?.query||""),_=new Set;return r.filter((c)=>{let u=dn(c?.chat_jid)?c.chat_jid.trim():"";if(!u||_.has(u))return!1;if(c?.archived_at)return!1;return _.add(u),!0}).filter((c)=>Ei(i,`@${String(c?.agent_name||"").trim()}`,c?.session_name,c?.chat_jid)).map((c)=>{let u=dn(c?.agent_name)?c.agent_name.trim():String(c?.chat_jid||"").replace(/^[^:]+:/,""),f=dn(c?.session_name)?c.session_name.trim():"",o=String(c?.chat_jid||"").trim();return{key:`agent:${o}`,kind:"agent",title:`@${u}`,subtitle:f||o,searchText:`@${u} ${f} ${o}`.trim(),visualHint:u.slice(0,1).toUpperCase()||"@",categoryLabel:"Agent",actionHint:"Open",chatJid:o}})}function r0(n){let r=Array.isArray(n?.slashCommands)?n.slashCommands:[],i=gr(n?.settings),_=String(n?.query||""),c=new Set;return r.filter((u)=>{let f=dn(u?.name)?u.name.trim():"";if(!f||c.has(f.toLowerCase()))return!1;return c.add(f.toLowerCase()),Jc(i.slashCommands,f)}).filter((u)=>Ei(_,u?.name,u?.description,u?.source)).map((u)=>{let f=String(u?.name||"").trim(),o=dn(u?.description)?u.description.trim():"slash command",s=dn(u?.source)?u.source.trim():"";return{key:`slash:${f}`,kind:"slash",title:f,subtitle:o,searchText:`${f} ${o} ${String(u?.source||"")}`.trim(),visualHint:"/",categoryLabel:s||"Slash",actionHint:"Insert",commandName:f}})}function us(n){return[...n0({agents:n?.agents,query:n?.query}),...al({commands:n?.workspaceCommands,settings:n?.settings,query:n?.query}),...r0({slashCommands:n?.slashCommands,settings:n?.settings,query:n?.query})]}var Sn;var Ec=Y(()=>{Sn=[{id:"toggle-workspace",label:"Toggle workspace",description:"Show or hide the workspace sidebar.",keywords:["workspace","sidebar","explorer"]},{id:"open-explorer",label:"Open explorer",description:"Open the workspace explorer sidebar.",keywords:["workspace","explorer","sidebar"]},{id:"toggle-chat-only",label:"Chat-only mode",description:"Toggle chat-only mode.",keywords:["chat","mode","layout"]},{id:"open-terminal-tab",label:"Open terminal in tab",description:"Open the terminal pane in a workspace tab.",keywords:["terminal","shell","tab"]},{id:"open-vnc-tab",label:"Open VNC in tab",description:"Open the VNC viewer in a workspace tab.",keywords:["vnc","remote","desktop","tab"]},{id:"toggle-terminal-dock",label:"Toggle terminal dock",description:"Show or hide the terminal dock.",keywords:["terminal","dock","shell"]},{id:"open-settings",label:"Settings",description:"Open the settings dialog.",keywords:["settings","preferences","config"]}]});var ec={};_n(ec,{QuickActionsSection:()=>i0});function dc(n,...r){let i=String(n||"").trim().toLowerCase();if(!i)return!0;return r.some((_)=>String(_||"").toLowerCase().includes(i))}function Sc(n){if(!Array.isArray(n))return null;return new Set(n.map((r)=>String(r||"").trim().toLowerCase()).filter(Boolean))}function i0({filter:n="",setStatus:r,mergeSettingsData:i}){let[_,c]=w(()=>Sn.map((z)=>z.id)),[u,f]=w([]),[o,s]=w([]),[$,b]=w(!0),[g,p]=w(!1),h=T(async()=>{b(!0);try{let[z,j]=await Promise.all([Ki(),pi("web:default").catch(()=>({commands:[]}))]),X=gr(z?.settings),t=Array.isArray(j?.commands)?j.commands:[];s(t),c(Array.isArray(X.workspaceCommands)?X.workspaceCommands:Sn.map((H)=>H.id)),f(Array.isArray(X.slashCommands)?X.slashCommands:t.map((H)=>String(H?.name||"").trim()).filter(Boolean))}catch(z){r?.(String(z?.message||z),"error")}finally{b(!1)}},[r]);P(()=>{h()},[h]);let v=D(()=>Sc(_),[_]),F=D(()=>Sc(u),[u]),y=D(()=>Sn.filter((z)=>dc(n,z.label,z.description,...z.keywords||[])),[n]),K=D(()=>o.filter((z)=>dc(n,z?.name,z?.description,z?.source)),[o,n]),W=T((z)=>{c((j)=>{let X=new Set((Array.isArray(j)?j:[]).map((t)=>String(t||"").trim()).filter(Boolean));if(X.has(z))X.delete(z);else X.add(z);return Sn.map((t)=>t.id).filter((t)=>X.has(t))})},[]),N=T((z)=>{f((j)=>{let X=new Set((Array.isArray(j)?j:[]).map((t)=>String(t||"").trim()).filter(Boolean));if(X.has(z))X.delete(z);else X.add(z);return o.map((t)=>String(t?.name||"").trim()).filter((t)=>t&&X.has(t))})},[o]),B=T(()=>{c(Sn.map((z)=>z.id)),f(o.map((z)=>String(z?.name||"").trim()).filter(Boolean))},[o]),U=T(async()=>{if(g)return;p(!0),r?.("Saving quick actions…","info");try{let z=await zi({workspaceCommands:_,slashCommands:u}),j=gr(z?.settings);i?.({quickActions:j}),window.dispatchEvent(new CustomEvent("piclaw:quick-actions-settings-updated",{detail:{settings:j}})),r?.("Quick Actions saved.","success")}catch(z){r?.(String(z?.message||z),"error")}finally{p(!1)}},[i,g,r,u,_]);if($)return l`<div class="settings-loading">Loading…</div>`;return l`
        <div class="settings-section">
            <h3>Timeline Quick Actions</h3>
            <p class="settings-hint">
                Choose which actions appear in the timeline typeahead. Agents are always pinned first, then workspace commands, then slash commands.
            </p>

            <div class="settings-row" style="align-items:center; gap:10px; margin-bottom:12px;">
                <button class="settings-addon-btn" onClick=${B} disabled=${g}>Enable all</button>
                <button class="settings-addon-btn settings-addon-btn-install" onClick=${U} disabled=${g}>
                    ${g?"Saving…":"Save & apply"}
                </button>
            </div>

            <h3 style="margin-top:8px;">Workspace commands</h3>
            <div class="settings-subsection-list">
                ${y.map((z)=>{let j=v?v.has(z.id.toLowerCase()):!0;return l`
                        <label class="settings-checkbox-row" key=${z.id}>
                            <input type="checkbox" checked=${j} onChange=${()=>W(z.id)} />
                            <div>
                                <div>${z.label}</div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${z.description}</div>
                            </div>
                        </label>
                    `})}
                ${y.length===0&&l`<div class="settings-hint">No workspace commands match this filter.</div>`}
            </div>

            <h3 style="margin-top:20px;">Slash commands</h3>
            <div class="settings-subsection-list">
                ${K.map((z)=>{let j=String(z?.name||"").trim(),X=F?F.has(j.toLowerCase()):!0;return l`
                        <label class="settings-checkbox-row" key=${j}>
                            <input type="checkbox" checked=${X} onChange=${()=>N(j)} />
                            <div>
                                <div><code>${j}</code></div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${z?.description||"slash command"}</div>
                            </div>
                        </label>
                    `})}
                ${K.length===0&&l`<div class="settings-hint">No slash commands match this filter.</div>`}
            </div>
        </div>
    `}var mc=Y(()=>{m();Kn();Ec()});var ac={};_n(ac,{KeychainSection:()=>u0});function _0(n){if(!n)return"—";try{return new Date(n).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"})}catch{return n}}function u0({filter:n=""}){let[r,i]=w([]),[_,c]=w(!0),[u,f]=w(null),[o,s]=w(!1),[$,b]=w(""),[g,p]=w(""),[h,v]=w(""),[F,y]=w(""),[K,W]=w(""),[N,B]=w("secret"),[U,z]=w(!1),[j,X]=w({}),[t,H]=w(null),[k,x]=w(null),[L,Q]=w(null),C=Z(null),O=Z(null),gn=Z(null),a=T(async()=>{c(!0),f(null);try{let M=await(await fetch("/agent/keychain")).json();if(M?.ok)i(M.entries||[]);else f(M?.error||"Failed to load keychain.")}catch(R){f("Failed to load keychain.")}finally{c(!1)}},[]);P(()=>{a()},[a]);let un=T(async()=>{let R=$.trim(),M=g;if(!R||!M)return;z(!0);try{let on=await(await fetch("/agent/keychain",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:R,secret:M,type:N,username:h.trim()||void 0,userNote:F,agentNote:K})})).json();if(on?.ok)b(""),p(""),v(""),y(""),W(""),B("secret"),s(!1),await a();else f(on?.error||"Failed to add entry.")}catch{f("Failed to add entry.")}finally{z(!1)}},[$,g,h,F,K,N,a]),ln=T(async(R)=>{try{let rn=await(await fetch("/agent/keychain",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:R})})).json();if(rn?.ok)x(null),Q((on)=>on?.name===R?null:on),await a();else f(rn?.error||"Failed to delete entry.")}catch{f("Failed to delete entry.")}},[a]),wn=T(async(R)=>{let M=R?.name;if(!M)return;let rn=j[M]||{},on=Object.prototype.hasOwnProperty.call(rn,"userNote")?rn.userNote:R.userNote||"",$n=Object.prototype.hasOwnProperty.call(rn,"agentNote")?rn.agentNote:R.agentNote||"";H(M);try{let Rn=await(await fetch("/agent/keychain/notes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:M,userNote:on,agentNote:$n})})).json();if(Rn?.ok)X((tr)=>{let mn={...tr||{}};return delete mn[M],mn}),await a();else f(Rn?.error||"Failed to save notes.")}catch{f("Failed to save notes.")}finally{H(null)}},[j,a]),I=T((R,M,rn)=>{X((on)=>({...on||{},[R]:{...(on||{})[R]||{},[M]:rn}}))},[]),V=T(async(R,M,rn)=>{try{let $n=await(await fetch("/agent/keychain/reveal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:R,master_password:M||void 0,totp_code:rn||void 0})})).json();if($n?.ok)Q({name:R,phase:"revealed",secret:$n.secret,username:$n.username,masterPassword:M});else if($n?.needs_master_password)Q((hn)=>({name:R,phase:"password",masterPassword:"",error:hn?.name===R&&hn?.masterPassword?$n.error:null})),requestAnimationFrame(()=>O.current?.focus());else if($n?.needs_totp)Q((hn)=>({name:R,phase:"totp",masterPassword:M,totpCode:"",error:hn?.name===R&&hn?.phase==="totp"&&hn?.totpCode?$n.error:null})),requestAnimationFrame(()=>gn.current?.focus());else Q({name:R,phase:"error",error:$n?.error||"Failed to reveal."})}catch{Q({name:R,phase:"error",error:"Failed to reveal."})}},[]),q=T((R)=>{if(L?.name===R&&L?.phase==="revealed"){Q(null);return}V(R,null,null)},[L,V]),yn=T((R)=>{let M=L?.masterPassword||"";if(!M)return;V(R,M,null)},[L,V]),G=T((R)=>{let M=L?.totpCode||"";if(M.length<6)return;V(R,L?.masterPassword,M)},[L,V]),d=T(async(R)=>{try{await navigator.clipboard.writeText(R)}catch{let M=document.createElement("textarea");M.value=R,M.style.position="fixed",M.style.opacity="0",document.body.appendChild(M),M.select(),document.execCommand("copy"),document.body.removeChild(M)}},[]);P(()=>{if(o)requestAnimationFrame(()=>C.current?.focus())},[o]);let cn=n.toLowerCase(),Bn=D(()=>{if(!cn)return r;return r.filter((R)=>R.name.toLowerCase().includes(cn)||(R.type||"").toLowerCase().includes(cn)||(R.envVar||"").toLowerCase().includes(cn)||(R.userNote||"").toLowerCase().includes(cn)||(R.agentNote||"").toLowerCase().includes(cn))},[r,cn]);if(_)return l`<div class="settings-section"><div class="settings-loading">Loading keychain…</div></div>`;return l`
        <div class="settings-section">
            ${u&&l`
                <div class="settings-keychain-error" role="alert">
                    ${u}
                    <button class="settings-keychain-dismiss" onClick=${()=>f(null)}>✕</button>
                </div>
            `}
            <div class="settings-keychain-toolbar" style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <span class="settings-hint" style="margin:0; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span>${Bn.length} entr${Bn.length===1?"y":"ies"}${cn?` matching "${n}"`:""}, encrypted at rest.</span>
                    <span style="display:inline-flex; align-items:center; gap:6px;">
                        <span>Click</span>
                        <span aria-hidden="true" style="display:inline-flex; width:18px; height:18px; align-items:center; justify-content:center; border-radius:999px; border:1px solid var(--border-color, rgba(120,120,120,.22)); background:var(--panel-bg, rgba(255,255,255,.04));">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </span>
                        <span>to reveal.</span>
                    </span>
                </span>
                <button class="settings-keychain-add-btn" onClick=${()=>s(!o)}>
                    ${o?"Cancel":"+ Add entry"}
                </button>
            </div>

            ${o&&l`
                <div class="settings-keychain-add-form">
                    <div class="settings-keychain-add-row">
                        <input ref=${C} type="text" placeholder="Entry name (e.g. github/my-token)"
                            value=${$} onInput=${(R)=>b(R.target.value)}
                            class="settings-keychain-input" />
                        <select value=${N} onChange=${(R)=>B(R.target.value)}
                            class="settings-keychain-select">
                            ${c0.map((R)=>l`<option value=${R}>${R}</option>`)}
                        </select>
                    </div>
                    <div class="settings-keychain-add-row">
                        <input type="password" placeholder="Secret value"
                            value=${g} onInput=${(R)=>p(R.target.value)}
                            class="settings-keychain-input settings-keychain-secret" />
                        <input type="text" placeholder="Username (optional)"
                            value=${h} onInput=${(R)=>v(R.target.value)}
                            class="settings-keychain-input" style="max-width:200px" />
                        <button class="settings-keychain-save-btn" onClick=${un}
                            disabled=${U||!$.trim()||!g}>
                            ${U?"Saving…":"Save"}
                        </button>
                    </div>
                    <div class="settings-keychain-add-row" style="align-items:stretch">
                        <textarea placeholder="User note (visible in this UI only)"
                            value=${F} onInput=${(R)=>y(R.target.value)}
                            class="settings-keychain-input" rows="2" style="resize:vertical; min-height:56px"></textarea>
                        <textarea placeholder="Agent note (safe to expose to agents)"
                            value=${K} onInput=${(R)=>W(R.target.value)}
                            class="settings-keychain-input" rows="2" style="resize:vertical; min-height:56px"></textarea>
                    </div>
                </div>
            `}

            <div class="settings-keychain-table-wrap">
                <table class="settings-table settings-keychain-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Env var</th>
                            <th>Updated</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Bn.length===0&&l`
                            <tr><td colspan="5" class="settings-keychain-empty">
                                ${cn?"No entries match the filter.":"No keychain entries."}
                            </td></tr>
                        `}
                        ${Bn.map((R)=>{let M=L?.name===R.name?L:null,rn=M?.phase==="revealed",on=M?.phase==="password",$n=M?.phase==="totp",hn=M?.phase==="error",Rn=j[R.name]||{},tr=Object.prototype.hasOwnProperty.call(Rn,"userNote")?Rn.userNote:R.userNote||"",mn=Object.prototype.hasOwnProperty.call(Rn,"agentNote")?Rn.agentNote:R.agentNote||"",xu=tr!==(R.userNote||"")||mn!==(R.agentNote||""),n_=t===R.name;return l`
                            <tr class="settings-keychain-row" key=${R.name}>
                                <td class="settings-keychain-name">${R.name}</td>
                                <td><span class="settings-keychain-type-badge">${R.type}</span></td>
                                <td class="settings-keychain-env">${R.envVar?l`<code>$${R.envVar}</code>`:"—"}</td>
                                <td class="settings-keychain-date">${_0(R.updatedAt)}</td>
                                <td class="settings-keychain-actions">
                                    <button class=${`settings-keychain-reveal-btn${rn?" active":""}`}
                                        onClick=${()=>q(R.name)}
                                        title=${rn?"Hide secret":"Reveal secret"}>
                                        ${rn?l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                                    </button>
                                    ${k===R.name?l`
                                            <span class="settings-keychain-confirm">Delete?
                                                <button class="settings-keychain-confirm-yes" onClick=${()=>ln(R.name)}>Yes</button>
                                                <button class="settings-keychain-confirm-no" onClick=${()=>x(null)}>No</button>
                                            </span>
                                        `:l`<button class="settings-keychain-delete-btn" onClick=${()=>x(R.name)} title="Delete">🗑</button>`}
                                </td>
                            </tr>
                            <tr class="settings-keychain-notes-row" key=${R.name+"-notes"}>
                                <td colspan="5">
                                    <div style="display:grid; grid-template-columns:1fr 1fr auto; gap:8px; align-items:start; padding:8px 0 10px 0;">
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">User note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Human/UI note only"
                                                value=${tr}
                                                onInput=${(sn)=>I(R.name,"userNote",sn.target.value)}></textarea>
                                        </label>
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">Agent-readable note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Safe guidance for agents"
                                                value=${mn}
                                                onInput=${(sn)=>I(R.name,"agentNote",sn.target.value)}></textarea>
                                        </label>
                                        <button class="settings-keychain-save-btn" style="margin-top:20px" disabled=${!xu||n_} onClick=${()=>wn(R)}>
                                            ${n_?"Saving…":"Save notes"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ${on&&l`
                                <tr class="settings-keychain-prompt-row" key=${R.name+"-pw"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">Master password:</span>
                                            <input ref=${O} type="password" autocomplete="off"
                                                placeholder="Enter keychain master password"
                                                class="settings-keychain-prompt-input"
                                                value=${M?.masterPassword||""}
                                                onInput=${(sn)=>Q((Yr)=>({...Yr,masterPassword:sn.target.value}))}
                                                onKeyDown=${(sn)=>{if(sn.key==="Enter")yn(R.name);if(sn.key==="Escape")Q(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>yn(R.name)}
                                                disabled=${!M?.masterPassword}>Unlock</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>Q(null)}>Cancel</button>
                                            ${M?.error&&l`<span class="settings-keychain-prompt-error">${M.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${$n&&l`
                                <tr class="settings-keychain-prompt-row" key=${R.name+"-totp"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">TOTP code:</span>
                                            <input ref=${gn} type="text" inputmode="numeric" autocomplete="one-time-code"
                                                maxlength="6" placeholder="000000"
                                                class="settings-keychain-prompt-input" style="width:90px;text-align:center;letter-spacing:0.15em"
                                                value=${M?.totpCode||""}
                                                onInput=${(sn)=>Q((Yr)=>({...Yr,totpCode:sn.target.value.replace(/\\D/g,"").slice(0,6)}))}
                                                onKeyDown=${(sn)=>{if(sn.key==="Enter")G(R.name);if(sn.key==="Escape")Q(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>G(R.name)}
                                                disabled=${(M?.totpCode||"").length<6}>Verify</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>Q(null)}>Cancel</button>
                                            ${M?.error&&l`<span class="settings-keychain-prompt-error">${M.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${rn&&l`
                                <tr class="settings-keychain-reveal-row" key=${R.name+"-reveal"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel">
                                            ${M.username&&l`
                                                <div class="settings-keychain-reveal-field">
                                                    <span class="settings-keychain-reveal-label">Username</span>
                                                    <code class="settings-keychain-reveal-value">${M.username}</code>
                                                    <button class="settings-keychain-copy-btn" onClick=${()=>d(M.username)} title="Copy username">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                    </button>
                                                </div>
                                            `}
                                            <div class="settings-keychain-reveal-field">
                                                <span class="settings-keychain-reveal-label">Secret</span>
                                                <code class="settings-keychain-reveal-value">${M.secret}</code>
                                                <button class="settings-keychain-copy-btn" onClick=${()=>d(M.secret)} title="Copy secret">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${hn&&l`
                                <tr class="settings-keychain-reveal-row" key=${R.name+"-error"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel" style="color: var(--error-color, #e55)">${M.error}</div>
                                    </td>
                                </tr>
                            `}
                        `})}
                    </tbody>
                </table>
            </div>
        </div>
    `}var c0;var nu=Y(()=>{m();c0=["secret","token","password","basic"]});var ru={};_n(ru,{ToolsSection:()=>g0});function g0({toolsets:n,filter:r="",settingsData:i,mergeSettingsData:_}){let c=n||[],[u,f]=w(()=>{let v={};for(let F of c)v[F.name]=!0;return v}),o=T((v)=>{f((F)=>({...F,[v]:!F[v]}))},[]),s=i?.searchMatchMode||"or",$=D(()=>{let v=Array.isArray(i?.toolResultCompactionTools)?i.toolResultCompactionTools:[];return new Set(v.filter((F)=>typeof F==="string").map((F)=>F.trim().toLowerCase()).filter(Boolean))},[i?.toolResultCompactionTools]),b=T(async()=>{let v=s==="or"?"and":"or";try{let y=await(await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({searchMatchMode:v})})).json().catch(()=>({}));if(y?.ok&&y?.settings)_?.(y.settings)}catch(F){console.warn("[settings/tools] Failed to save search match mode.",F)}},[s,_]),g=T(async(v)=>{let F=String(v||"").trim().toLowerCase();if(!F)return;let y=new Set($);if(y.has(F))y.delete(F);else y.add(F);try{let W=await(await fetch("/agent/settings/compaction",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({toolResultCompactionTools:Array.from(y).sort()})})).json().catch(()=>({}));if(W?.ok&&W?.settings)_?.(W.settings)}catch(K){console.warn("[settings/tools] Failed to save tool compaction settings.",K)}},[$,_]),p=r.toLowerCase(),h=D(()=>{if(!p)return c;return c.map((v)=>{let F=v.tools.filter((y)=>y.name.toLowerCase().includes(p)||v.name.toLowerCase().includes(p)||(y.summary||"").toLowerCase().includes(p));return F.length>0?{...v,tools:F}:null}).filter(Boolean)},[c,p]);if(c.length===0)return l`<div class="settings-section"><p class="settings-hint">Tool data not available.</p></div>`;return l`
        <div class="settings-section">
            <div class="settings-search-options">
                <h4 style="margin:0 0 8px 0">Search</h4>
                <div class="settings-row">
                    <label>Match mode</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" checked=${s==="and"} onChange=${b} />
                        <span class="settings-hint" style="margin:0">
                            ${s==="or"?"Any keyword (OR) — results match at least one search term":"All keywords (AND) — results must match every search term"}
                        </span>
                    </div>
                </div>
            </div>
            ${h.map((v)=>{let F=u[v.name]!==!1;return l`
                <div class="settings-toolset">
                    <div class="settings-toolset-header">
                        <label class="settings-toolset-toggle">
                            <input type="checkbox" checked=${F} onChange=${()=>o(v.name)} />
                            <span class="settings-toolset-icon">${f0[v.name]||s0}</span>
                            <strong>${v.name}</strong>
                        </label>
                        <span class="settings-hint" style="margin:0">${v.description}</span>
                    </div>
                    ${F&&l`<div class="settings-tool-list">
                        <div class="settings-tool-row settings-tool-row-header" aria-hidden="true">
                            <span class="settings-tool-status-header">Enabled</span>
                            <span class="settings-tool-name">Tool</span>
                            <span class="settings-tool-compact-header">Compact</span>
                            <span class="settings-tool-kind">Kind</span>
                            <span class="settings-tool-summary">Summary</span>
                            <span class="settings-tool-source">Source</span>
                        </div>
                        ${v.tools.map((y)=>{let K=String(y.name||"").trim().toLowerCase(),W=$.has(K);return l`
                                <div class="settings-tool-row">
                                    <input type="checkbox" checked disabled />
                                    <span class="settings-tool-name">${y.name}</span>
                                    <span class="settings-tool-compact">
                                        <input
                                            type="checkbox"
                                            checked=${W}
                                            onChange=${()=>g(y.name)}
                                            title=${W?"Disable tool-result compaction for this tool":"Enable tool-result compaction for this tool"}
                                        />
                                    </span>
                                    <span class="settings-tool-kind" title=${y.kind}>${o0[y.kind]||"?"}</span>
                                    ${y.summary&&l`<span class="settings-tool-summary">${y.summary}</span>`}
                                    ${!y.summary&&l`<span class="settings-tool-summary"></span>`}
                                    <span class="settings-tool-source">${l0[y.name]||v.name}</span>
                                </div>
                            `})}
                    </div>`}
                </div>
            `})}
            ${h.length===0&&l`<p class="settings-hint">No tools match "${r}"</p>`}
            <p class="settings-hint">Tool activation is managed by the agent runtime. Group checkboxes collapse/expand; the “Compact” column controls tool-result compaction eligibility.</p>
        </div>
    `}var f0,l0,o0,s0;var iu=Y(()=>{m();f0={core:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M7.5 10l2.5 2-2.5 2"/><path d="M12.5 15H16"/></svg>`,discovery:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,attachments:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,"model-control":l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M9 15c.83.67 2 1 3 1s2.17-.33 3-1"/></svg>`,data:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,workspace:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,automation:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,remote:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,browser:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,ui:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,experiments:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v7l4.6 7.7A1 1 0 0 1 18.7 19H5.3a1 1 0 0 1-.9-1.3L9 10z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>`,lifecycle:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`},l0={read:"pi-core",write:"pi-core",edit:"pi-core",bash:"pi-core",powershell:"pi-core",find:"pi-core",grep:"pi-core",ls:"pi-core",list_tools:"internal-tools",activate_tools:"tool-activation",reset_active_tools:"tool-activation",list_scripts:"runtime-scripts",attach_file:"file-attachments",read_attachment:"file-attachments",export_attachment:"file-attachments",get_model_state:"model-control",list_models:"model-control",switch_model:"model-control",switch_thinking:"model-control",messages:"messages-crud",introspect_sql:"sql-introspect",keychain:"keychain-tools",search_workspace:"workspace-search",refresh_workspace_index:"workspace-search",open_office_viewer:"office-viewer",office_read:"office-viewer",office_write:"office-viewer",open_workspace_file:"open-workspace-file",image_process:"image-processing",schedule_task:"scheduled-tasks",scheduled_tasks:"scheduled-tasks",bun_run:"bun-runner",exec_batch:"exec-batch",search_tool_output:"search-tool-output",ssh:"ssh",proxmox:"proxmox",portainer:"portainer",mcp:"mcp",cdp_browser:"cdp-browser",send_adaptive_card:"send-adaptive-card",send_dashboard_widget:"send-dashboard-widget",start_autoresearch:"autoresearch",stop_autoresearch:"autoresearch",autoresearch_status:"autoresearch",exit_process:"exit-process",env:"env-tools"},o0={"read-only":"\uD83D\uDD0D",mutating:"✏️",mixed:"\uD83D\uDD04"},s0=l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`});var _u={};_n(_u,{AddonsSection:()=>$0});function $0({setStatus:n,filter:r=""}){let[i,_]=w(null),[c,u]=w(!0),[f,o]=w(null),[s,$]=w(!1),[b,g]=w({runtime:"",windowsNative:!1}),[p,h]=w([]),[v,F]=w([]);function y(){let t=new URLSearchParams;try{let k=(localStorage.getItem("piclaw_addons_catalog_url")||"").trim(),x=(localStorage.getItem("piclaw_addons_catalog_urls")||"").split(/\r?\n/).map((Q)=>Q.trim()).filter(Boolean),L=localStorage.getItem("piclaw_addons_repo_url");if(k)t.append("catalog_url",k);for(let Q of x)t.append("catalog_url",Q);if(L)t.set("repo_url",L)}catch(k){}let H=t.toString();return H?`?${H}`:""}let K=T(async()=>{try{let[t,H]=await Promise.all([fetch(`/agent/addons${y()}`),fetch("/agent/settings-data")]),k=await t.json();if(k.error)throw Error(k.error);_(k.addons||[]),h(k.sources||[]),F(k.failed_sources||[]);let x=await H.json().catch(()=>({})),L=typeof x?.runtimePlatform==="string"?x.runtimePlatform:"";g({runtime:L,windowsNative:L==="win32"})}catch(t){_(null),n?.(String(t.message||t),"error")}finally{u(!1)}},[n]);P(()=>{K()},[]);let W=T(async(t)=>{if(f)return;o({slug:t,action:"install"}),n?.(`Installing ${t}…`,"info");try{let k=await(await fetch(`/agent/addons/install${y()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:t})})).json();if(k.error){n?.(k.error,"error");return}$(!0);let x=[k.message,k.warning].filter(Boolean).join(" ");n?.(x||"Add-on installed.","success"),await K()}catch(H){n?.(String(H.message||H),"error")}finally{o(null)}},[f,K,n]),N=T(async(t)=>{if(f)return;o({slug:t,action:"remove"}),n?.(`Removing ${t}…`,"info");try{let k=await(await fetch(`/agent/addons/uninstall${y()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:t})})).json();if(k.error){n?.(k.error,"error");return}$(!0);let x=[k.message,k.warning].filter(Boolean).join(" ");n?.(x||"Add-on removed.","success"),await K()}catch(H){n?.(String(H.message||H),"error")}finally{o(null)}},[f,K,n]),B=T(async()=>{if(f)return;o({slug:null,action:"restart"}),n?.("Restarting piclaw…","info");try{let H=await(await fetch("/agent/addons/restart",{method:"POST"})).json();if(H.error){n?.(H.error,"error"),o(null);return}n?.(H.message||"Restarting piclaw…","success"),$(!1),(async(x=30,L=2000)=>{for(let Q=0;Q<x;Q++){await new Promise((C)=>setTimeout(C,L));try{if((await fetch("/agent/addons",{signal:AbortSignal.timeout(3000)})).ok){await K(),o(null),n?.("Restart complete — add-ons refreshed.","success");return}}catch(C){}}o(null),n?.("Backend did not return in time. Reload the page manually.","warning")})()}catch(t){n?.(String(t.message||t),"error"),o(null)}},[f,n,K]);if(c)return l`<div class="settings-loading">Fetching add-ons\u2026</div>`;if(!i)return l`<div class="settings-section"><p class="settings-hint">Could not load add-ons.</p></div>`;let U=r.toLowerCase(),z=U?i.filter((t)=>t.slug.toLowerCase().includes(U)||(t.description||"").toLowerCase().includes(U)||(t.tags||[]).some((H)=>H.toLowerCase().includes(U))):i,j=f?.slug||null,X=f?f.action==="remove"?`Removing ${f.slug}…`:f.action==="restart"?"Restarting piclaw…":`Installing ${f.slug}…`:"";return l`
        <div class=${`settings-section settings-addon-panel${f?" busy":""}`} aria-busy=${f?"true":"false"}>
            <div class="settings-addon-toolbar">
                <div>
                    <p class="settings-hint">
                        ${p.length<=1?l`Catalog from <a href="https://github.com/rcarmo/piclaw-addons" target="_blank">rcarmo/piclaw-addons</a>.`:l`${p.length} catalog sources merged.`}
                        ${" "}Package-first install via Bun; restart required after install/uninstall.
                    </p>
                    ${v.length>0&&l`
                        <div class="settings-addon-error" role="alert">
                            Failed to fetch ${v.length} catalog source${v.length>1?"s":""}:
                            ${v.map((t)=>l` <code style="font-size:0.82em;word-break:break-all">${t}</code>`)}
                        </div>
                    `}
                    ${p.length>1&&l`
                        <details class="settings-hint" style="margin-top:4px">
                            <summary style="cursor:pointer">Active catalog sources (${p.length})</summary>
                            <ul style="margin:4px 0 0 16px;font-size:0.82em">
                                ${p.map((t)=>l`<li style="word-break:break-all"><code>${t}</code></li>`)}
                            </ul>
                        </details>
                    `}
                    ${b.windowsNative&&l`
                        <div class="settings-addon-error" role="alert">
                            Native Windows add-on installs are higher risk: Bun package installs, symlink cleanup, locked files, and restart timing can all be less predictable than in Linux/WSL. Prefer WSL or a container when possible.
                        </div>
                    `}
                </div>
            </div>
            <div class="settings-addon-list">
                ${f&&l`
                    <div class="settings-addon-panel-overlay" role="status" aria-live="polite" aria-label=${X}>
                        <div class="settings-addon-panel-overlay-card">
                            <div class="settings-spinner"></div>
                            <span>${X}</span>
                        </div>
                    </div>
                `}
                ${z.map((t)=>{let H=(t.skills||[]).length>0,k=t.type==="extension",x=H&&k?"extension + skill":H?"skill":"extension",L=H&&!k?"settings-tag-skill":"",Q=typeof t.homepage==="string"&&t.homepage.trim()?t.homepage.trim():"";return l`
                    <div class=${`settings-addon-card${t.installed?" installed":""}`}>
                        <div class="settings-addon-card-header">
                            ${Q?l`<a class="settings-addon-name-link" href=${Q} target="_blank" rel="noopener noreferrer">${t.slug}</a>`:l`<strong>${t.slug}</strong>`}
                            <span class=${`settings-tag settings-tag-type ${L}`}>${x}</span>
                            <span class="settings-addon-version">${t.installed?t.installedVersion||"?":t.version||""}</span>
                            ${t.installKind&&l`<span class="settings-tag">${t.installKind}</span>`}
                            ${t.hasUpdate&&l`<span class="settings-tag settings-tag-skill">\u2191 ${t.version}</span>`}
                            <div class="settings-addon-actions">
                                ${t.installed?l`
                                    ${t.hasUpdate&&l`<button class="settings-addon-btn settings-addon-btn-upgrade" disabled=${Boolean(f)} onClick=${()=>W(t.slug)}>${j===t.slug?"…":"Update"}</button>`}
                                    <button class="settings-addon-btn settings-addon-btn-remove" disabled=${Boolean(f)} onClick=${()=>N(t.slug)}>${j===t.slug?"…":"Remove"}</button>
                                `:l`
                                    <button class="settings-addon-btn settings-addon-btn-install" disabled=${Boolean(f)} onClick=${()=>W(t.slug)}>${j===t.slug?"…":"Install"}</button>
                                `}
                            </div>
                        </div>
                        <div class="settings-addon-card-body">${t.description}</div>
                        <div class="settings-addon-card-footer">
                            <div class="settings-addon-tags">${(t.tags||[]).map((C)=>l`<span class="settings-tag">${C}</span>`)}${(t.skills||[]).map((C)=>l`<span class="settings-tag settings-tag-skill">\ud83d\udcdd ${C}</span>`)}</div>
                        </div>
                    </div>
                `})}
                ${z.length===0&&l`<p class="settings-hint">No add-ons match "${r}"</p>`}
            </div>
            ${s&&l`
                <div class="settings-addon-restart-notice" role="status" aria-live="polite">
                    <span>Extension changes are installed but inactive until piclaw restarts.</span>
                    <button class="settings-addon-btn settings-addon-btn-restart-now" type="button" disabled=${Boolean(f)} onClick=${B}>Restart Now</button>
                </div>
            `}
        </div>
    `}var cu=Y(()=>{m()});var b0={};function di(n,r){try{let i=localStorage.getItem(n);return i===null?r:i==="true"}catch{return r}}function Mr(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function w0(n,r){try{return localStorage.getItem(n)||r}catch{return r}}function t0(n,r){try{localStorage.setItem(n,r)}catch(i){}}function y0(n,r,i,_){try{return Yn(localStorage.getItem(n),{fallback:r,min:i,max:_})}catch{return Yn(r,{fallback:r,min:i,max:_})}}function x0(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function h0(){let[n,r]=w(()=>di("piclaw_vim_mode",!1)),[i,_]=w(()=>di("piclaw_show_whitespace",!0)),[c,u]=w(()=>di("piclaw_md_live_preview",!0)),[f,o]=w(()=>y0("piclaw_editor_font_size",13,10,24)),[s,$]=w(()=>w0("piclaw_editor_font_family","")),b=T((g,p,h)=>{let v=!p;h(v),Mr(g,v)},[]);return l`
        <div class="settings-section">
            <h3>Editor</h3>
            <div class="settings-row">
                <label>Vim mode</label>
                <input type="checkbox" checked=${n}
                    onChange=${()=>{let g=!n;r(g),Mr("piclaw_vim_mode",g)}} />
            </div>
            <div class="settings-row">
                <label>Show whitespace</label>
                <input type="checkbox" checked=${i}
                    onChange=${()=>{let g=!i;_(g),Mr("piclaw_show_whitespace",g)}} />
            </div>
            <div class="settings-row">
                <label>Markdown live preview</label>
                <input type="checkbox" checked=${c}
                    onChange=${()=>{let g=!c;u(g),Mr("piclaw_md_live_preview",g)}} />
            </div>
            <div class="settings-row">
                <label>Font size (px)</label>
                <${e}
                    label="editor font size"
                    value=${f}
                    min=${10}
                    max=${24}
                    fallback=${13}
                    width="70px"
                    onChange=${(g)=>{o(g),x0("piclaw_editor_font_size",g)}}
                />
            </div>
            <div class="settings-row">
                <label>Font family</label>
                <input type="text" value=${s}
                    onInput=${(g)=>{let p=g.target.value;$(p),t0("piclaw_editor_font_family",p)}}
                    placeholder="monospace (default)" />
            </div>
            <p class="settings-hint settings-local-only-hint">This browser only. Editor changes are stored in local browser storage and take effect when you next open or reload a file tab.</p>
        </div>
    `}var v0;var uu=Y(()=>{m();rr();Cn();v0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;qn({id:"editor",label:"Editor",icon:v0,component:h0,order:150})});var z0={};function Si(n,r){try{let i=localStorage.getItem(n);return i===null?r:i==="true"}catch{return r}}function ei(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function mi(n,r){try{return localStorage.getItem(n)||r}catch{return r}}function ai(n,r){try{localStorage.setItem(n,r)}catch(i){}}function p0(){let[n,r]=w(()=>Si("piclaw_dev_mode",!1)),[i,_]=w(()=>mi("piclaw_addons_catalog_url","")),[c,u]=w(()=>mi("piclaw_addons_catalog_urls","")),[f,o]=w(()=>mi("piclaw_addons_repo_url","")),[s,$]=w(()=>Si("piclaw_debug_sse",!1)),[b,g]=w(()=>Si("piclaw_debug_tool_calls",!1)),p=T(()=>{let h=!n;r(h),ei("piclaw_dev_mode",h)},[n]);return l`
        <div class="settings-section">
            <h3>Developer</h3>
            <div class="settings-row">
                <label>Developer mode</label>
                <input type="checkbox" checked=${n} onChange=${p} />
            </div>

            <p class="settings-hint settings-local-only-hint">This browser only. Developer-mode toggles and add-on catalog overrides are stored in local browser storage.</p>

            ${n&&l`
                <h3 style="margin-top:16px">Add-on Sources</h3>
                <div class="settings-row">
                    <label>Catalog URL</label>
                    <input type="text" value=${i}
                        onInput=${(h)=>{let v=h.target.value;_(v),ai("piclaw_addons_catalog_url",v)}}
                        placeholder="https://raw.githubusercontent.com/.../catalog.json" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Primary add-on catalog URL. Leave empty to use the default (<code>rcarmo/piclaw-addons</code>).</p>
                <div class="settings-row" style="align-items:flex-start;">
                    <label>Additional catalog URLs</label>
                    <textarea
                        value=${c}
                        onInput=${(h)=>{let v=h.target.value;u(v),ai("piclaw_addons_catalog_urls",v)}}
                        placeholder="One URL per line\nhttps://example.com/catalog.json"
                        style="max-width:400px; min-height:86px; resize:vertical;"
                    ></textarea>
                </div>
                <p class="settings-hint" style="margin-top:0">Fetched in addition to the primary/default catalog. One URL per line.</p>
                <div class="settings-row">
                    <label>Repo URL</label>
                    <input type="text" value=${f}
                        onInput=${(h)=>{let v=h.target.value;o(v),ai("piclaw_addons_repo_url",v)}}
                        placeholder="https://github.com/.../piclaw-addons.git" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Override the git repo used for <code>bun add</code> installs. Leave empty for default.</p>

                <h3 style="margin-top:16px">Debug</h3>
                <div class="settings-row">
                    <label>Log SSE events</label>
                    <input type="checkbox" checked=${s}
                        onChange=${()=>{let h=!s;$(h),ei("piclaw_debug_sse",h)}} />
                </div>
                <div class="settings-row">
                    <label>Log tool calls</label>
                    <input type="checkbox" checked=${b}
                        onChange=${()=>{let h=!b;g(h),ei("piclaw_debug_tool_calls",h)}} />
                </div>
                <p class="settings-hint">Debug flags take effect on next page reload.</p>
            `}
        </div>
    `}var K0;var fu=Y(()=>{m();rr();K0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;qn({id:"developer",label:"Developer",icon:K0,component:p0,order:900})});var I0={};_n(I0,{openSettingsDialog:()=>Z0,SettingsDialogContent:()=>Ir,SettingsDialog:()=>D0});function wr(n){$r.push({ts:performance.now(),label:n})}function F0(){if(!$r.length)return;let n=$r[0].ts,r=$r.map((i)=>`+${(i.ts-n).toFixed(1)}ms ${i.label}`);console.info(`[settings-dialog perf]
`+r.join(`
`));try{window.__piclawSettingsPerfLog=r}catch(i){}try{fetch("/agent/client-perf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({label:"settings-dialog",lines:r})}).catch((i)=>{})}catch(i){}$r.length=0}function W0(n){let r=Zr.get(n);if(r)return Promise.resolve(r);let i=qr.get(n);if(i)return i;let _=B0[n]().then((c)=>{return Zr.set(n,c),qr.delete(n),c}).catch((c)=>{throw qr.delete(n),c});return qr.set(n,_),_}function Dr(n="Loading…"){return l`
        <div class="settings-loading settings-loading-pane" role="status" aria-live="polite">
            <span class="settings-spinner"></span>
            <span>${n}</span>
        </div>
    `}function Ir({onClose:n}){wr("SettingsDialogContent-render-start");let[r,i]=w(()=>ui()||"general"),[_,c]=w(lu),[u,f]=w(null),[o,s]=w(""),[,$]=w(0),[b,g]=w(()=>Object.fromEntries(Zr.entries())),[p,h]=w(null),[v,F]=w({compact:!1,narrow:!1}),y=Z(null),K=Z(null);P(()=>{wr("SettingsDialogContent-mounted"),F0()},[]),P(()=>{let x=(L)=>{if(L.key==="Escape")n()};return window.addEventListener("keydown",x),()=>window.removeEventListener("keydown",x)},[n]),P(()=>{let x=(L)=>{let Q=typeof L?.detail?.section==="string"?L.detail.section.trim():"";if(Q)i(Q),s("")};return window.addEventListener("piclaw:open-settings",x),()=>window.removeEventListener("piclaw:open-settings",x)},[]),P(()=>{let x=()=>$((L)=>L+1);return window.addEventListener("piclaw:settings-panes-changed",x),()=>window.removeEventListener("piclaw:settings-panes-changed",x)},[]),P(()=>{fetch("/agent/settings-data").then((x)=>x.json()).then((x)=>{lu=x,c(x)}).catch(()=>c({}))},[]),P(()=>{let x=K.current;if(!x)return;let L=()=>{let Q=x.clientWidth||0;F((C)=>{let O={compact:Q>0&&Q<=860,narrow:Q>0&&Q<=720};return C.compact===O.compact&&C.narrow===O.narrow?C:O})};if(L(),typeof ResizeObserver==="function"){let Q=new ResizeObserver(()=>L());return Q.observe(x),()=>Q.disconnect()}return window.addEventListener("resize",L),()=>window.removeEventListener("resize",L)},[]);let W=[...su].sort((x,L)=>(x.order??500)-(L.order??500)),B=H_().map((x)=>({id:x.id,label:x.label,icon:x.icon,searchable:x.searchable||!1,placeholder:x.searchPlaceholder,order:x.order??500,isExtension:!0,component:x.component})).sort(ci),U=[...W,...B],z=U.find((x)=>x.id===r)||su.find((x)=>x.id===r);P(()=>{if(z?.searchable)requestAnimationFrame(()=>y.current?.focus())},[r]),P(()=>{if(z?.isExtension){h(null);return}let x=!1;if(b[r]){h(null);return}return h(r),W0(r).then((L)=>{if(x)return;g((Q)=>Q?.[r]?Q:{...Q||{},[r]:L})}).catch((L)=>{if(x)return;console.error(`[settings-dialog] Failed to lazy-load section "${r}".`,L)}).finally(()=>{if(!x)h((L)=>L===r?null:L)}),()=>{x=!0}},[r,z?.isExtension,b]);let j=T((x,L="info")=>{f(x?{text:x,type:L}:null)},[]),X=T((x)=>{i(x),s("");let L=k0[x];if(L&&!ou.has(x))ou.add(x),L().then(()=>$((Q)=>Q+1)).catch((Q)=>{})},[]),t=T((x)=>{c((L)=>({...L||{},...x||{}}))},[]),H=()=>{if(z?.isExtension){if(!z.component)return Dr("Loading pane…");let L=z.component;return l`<${L} filter=${o} />`}let x=b[r];if(!x||p===r)return Dr(`Loading ${z?.label||"settings"}…`);switch(r){case"general":return l`<${x} settingsData=${_} setStatus=${j} mergeSettingsData=${t} />`;case"sessions":return l`<${x} settingsData=${_} setStatus=${j} mergeSettingsData=${t} />`;case"recordings":return l`<${x} filter=${o} setStatus=${j} />`;case"compaction":return l`<${x} settingsData=${_} setStatus=${j} mergeSettingsData=${t} />`;case"keyboard":return l`<${x} filter=${o} setStatus=${j} />`;case"workspace":return l`<${x} settingsData=${_} setStatus=${j} mergeSettingsData=${t} />`;case"environment":return l`<${x} settingsData=${_} filter=${o} setStatus=${j} mergeSettingsData=${t} />`;case"providers":return l`<${x} providers=${_?.providers} setStatus=${j} />`;case"models":return l`<${x} filter=${o} />`;case"theme":return l`<${x} themes=${_?.themes} colorKeys=${_?.colorKeys} settingsData=${_} setStatus=${j} mergeSettingsData=${t} />`;case"scheduled-tasks":return l`<${x} filter=${o} setStatus=${j} />`;case"quick-actions":return l`<${x} filter=${o} setStatus=${j} mergeSettingsData=${t} />`;case"keychain":return l`<${x} filter=${o} />`;case"tools":return l`<${x} toolsets=${_?.toolsets} filter=${o} settingsData=${_} mergeSettingsData=${t} />`;case"addons":return l`<${x} setStatus=${j} filter=${o} />`;default:return Dr("Loading settings…")}},k=!z;return wr("SettingsDialogContent-render-end"),l`
        <div class="settings-dialog-backdrop" onClick=${(x)=>{if(x.target===x.currentTarget)n()}}>
            <div ref=${K} data-testid="settings-dialog" class=${`settings-dialog${v.compact?" settings-dialog-compact":""}${v.narrow?" settings-dialog-narrow":""}`}>
                <div class="settings-dialog-header">
                    <span class="settings-dialog-title">Settings</span>
                    ${z?.searchable&&l`
                        <input ref=${y} type="text" class="settings-header-filter"
                            placeholder=${z.placeholder||"Filter…"}
                            value=${o} onInput=${(x)=>s(x.target.value)} />
                    `}
                    <button class="settings-dialog-close" onClick=${n} title="Close (Esc)">✕</button>
                </div>
                <div class="settings-dialog-body">
                    <nav class="settings-nav">
                        ${U.map((x,L)=>{let Q=L>0&&!U[L-1].isExtension,C=x.isExtension&&Q;return l`
                                ${C&&l`<div class="settings-nav-separator"></div>`}
                                <button class=${`settings-nav-item ${x.id===r?"active":""}`} onClick=${()=>X(x.id)}>
                                    <span class="settings-nav-icon">${x.icon}</span>
                                    <span class="settings-nav-label">${x.label}</span>
                                </button>
                            `})}
                    </nav>
                    <main class="settings-content">
                        ${k?Dr("Loading settings…"):H()}
                    </main>
                </div>
                ${u&&l`
                    <div class=${`settings-status-bar settings-status-bar-${u.type}`}>
                        ${u.type==="info"&&l`<span class="settings-spinner"></span>`}
                        <span>${u.text}</span>
                        ${u.type!=="info"&&l`<button class="settings-status-dismiss" onClick=${()=>f(null)}>✕</button>`}
                    </div>
                `}
            </div>
        </div>
    `}function D0(){let[n,r]=w(!1);if(P(()=>{let i=(c)=>{let u=Wr(c?.detail?.section);if(u)try{window.__piclawSettingsRequestedSection=u}catch(f){}r(!0)};window.addEventListener("piclaw:open-settings",i);let _=N_();if(_.open){if(_.section)try{window.__piclawSettingsRequestedSection=_.section}catch(c){}r(!0)}return()=>window.removeEventListener("piclaw:open-settings",i)},[]),!n)return null;return l`<${T_} className="settings-portal"><${Ir} onClose=${()=>r(!1)} /><//>`}function Z0(n={}){L_(n)}var $r,lu=null,Zr,qr,B0,k0,ou,j0,R0,T0,U0,H0,L0,N0,G0,V0,P0,X0,Q0,A0,M0,q0,su;var gu=Y(()=>{m();U_();rr();nc();$r=[];wr("module-eval-start");wr("imports-done");Zr=new Map,qr=new Map;Zr.set("general",Ti);B0={general:()=>Promise.resolve(Ti),sessions:()=>Promise.resolve().then(() => (_c(),ic)).then((n)=>n.SessionsSection),recordings:()=>Promise.resolve().then(() => (uc(),cc)).then((n)=>n.RecordingsSection),compaction:()=>Promise.resolve().then(() => (lc(),fc)).then((n)=>n.CompactionSection),keyboard:()=>Promise.resolve().then(() => (xc(),yc)).then((n)=>n.KeyboardSection),workspace:()=>Promise.resolve().then(() => (kc(),Bc)).then((n)=>n.WorkspaceSection),environment:()=>Promise.resolve().then(() => (jc(),Wc)).then((n)=>n.EnvironmentSection),providers:()=>Promise.resolve().then(() => (Tc(),Rc)).then((n)=>n.ProvidersSection),models:()=>Promise.resolve().then(() => (Hc(),Uc)).then((n)=>n.ModelsSection),theme:()=>Promise.resolve().then(() => (Dc(),qc)).then((n)=>n.ThemeSection),"scheduled-tasks":()=>Promise.resolve().then(() => (Yc(),Ic)).then((n)=>n.ScheduledTasksSection),"quick-actions":()=>Promise.resolve().then(() => (mc(),ec)).then((n)=>n.QuickActionsSection),keychain:()=>Promise.resolve().then(() => (nu(),ac)).then((n)=>n.KeychainSection),tools:()=>Promise.resolve().then(() => (iu(),ru)).then((n)=>n.ToolsSection),addons:()=>Promise.resolve().then(() => (cu(),_u)).then((n)=>n.AddonsSection)},k0={"editor-settings":()=>Promise.resolve().then(() => (uu(),b0)).then(()=>{}),developer:()=>Promise.resolve().then(() => (fu(),z0)).then(()=>{})},ou=new Set;j0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M8.5 5.9L9.6 2.3h4.8l1.1 3.6 3.7-.8 2.4 4.1-2.6 2.8 2.6 2.8-2.4 4.1-3.7-.8-1.1 3.6H9.6l-1.1-3.6-3.7.8-2.4-4.1L5 12 2.4 9.2l2.4-4.1z"/></svg>`,R0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,T0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.2"/><path d="m13 10 4-2.5v9L13 14z"/></svg>`,U0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 10 9 10"/><path d="M12 7v5l3 3"/></svg>`,H0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,L0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/><path d="M8 7v10"/><path d="M16 7v10"/></svg>`,N0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01"/><path d="M10 9h.01"/><path d="M14 9h.01"/><path d="M18 9h.01"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M7 17h10"/></svg>`,G0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,V0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none"/><line x1="12" y1="9" x2="12" y2="5"/><circle cx="12" cy="4" r="1.5"/></svg>`,P0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.53-.21-1.01-.55-1.36-.34-.36-.55-.84-.55-1.37 0-1.1.9-2 2-2h2.36c3.08 0 5.64-2.56 5.64-5.64C22.9 5.85 18.05 2 12 2z"/><circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none"/></svg>`,X0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M7 3.5 4 6"/><path d="m17 3.5 3 2.5"/></svg>`,Q0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,A0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,M0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="14" r="3"/><path d="M11 14h9"/><path d="M16 14v-2"/><path d="M19 14v2"/></svg>`,q0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,su=[{id:"general",label:"General",icon:j0,searchable:!1,order:10},{id:"sessions",label:"Sessions",icon:R0,searchable:!1,order:12},{id:"recordings",label:"Recordings",icon:T0,searchable:!0,placeholder:"Filter recordings…",order:12.5},{id:"compaction",label:"Compaction",icon:U0,searchable:!1,order:13},{id:"keyboard",label:"Keyboard",icon:N0,searchable:!0,placeholder:"Filter shortcuts…",order:14},{id:"workspace",label:"Workspace",icon:H0,searchable:!1,order:15},{id:"environment",label:"Environment",icon:L0,searchable:!0,placeholder:"Filter environment…",order:16},{id:"providers",label:"Providers",icon:G0,searchable:!1,order:20},{id:"models",label:"Models",icon:V0,searchable:!0,placeholder:"Filter models…",order:30},{id:"theme",label:"Appearance",icon:P0,searchable:!1,order:40},{id:"scheduled-tasks",label:"Scheduled Tasks",icon:X0,searchable:!0,placeholder:"Filter scheduled tasks…",order:65},{id:"quick-actions",label:"Quick Actions",icon:A0,searchable:!0,placeholder:"Filter quick actions…",order:70},{id:"keychain",label:"Keychain",icon:M0,searchable:!0,placeholder:"Filter entries…",order:75},{id:"tools",label:"Tools",icon:Q0,searchable:!0,placeholder:"Filter tools…",order:80},{id:"addons",label:"Add-ons",icon:q0,searchable:!0,placeholder:"Filter add-ons…",order:90}]});m();gu();rr();var Y0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`;function C0({label:n,body:r,filter:i=""}){return l`
    <div class="settings-section">
      <h3>${n}</h3>
      <p class="settings-hint">Mock add-on pane rendered by the settings widget fixture.</p>
      <div class="settings-addon-grid">
        ${["Credentials","Routes","Runtime options"].filter((_)=>!i||_.toLowerCase().includes(String(i).toLowerCase())).map((_)=>l`
          <div class="settings-addon-card">
            <div class="settings-addon-card-header">
              <div>
                <div class="settings-addon-name">${_}</div>
                <div class="settings-addon-subtitle">${r}</div>
              </div>
              <span class="settings-addon-enabled">fixture</span>
            </div>
            <div class="settings-row settings-row-vertical">
              <label>Mock field</label>
              <input type="text" value=${`${n.toLowerCase().replace(/\s+/g,"-")}:${_.toLowerCase().replace(/\s+/g,"-")}`} readonly />
            </div>
          </div>
        `)}
      </div>
    </div>
  `}function O0(){let n=[{id:"fixture-z-observability",label:"Observability",body:"Latency, traces, and metrics."},{id:"fixture-a-portainer",label:"Portainer",body:"Container endpoint settings."},{id:"fixture-m-proxmox",label:"Proxmox",body:"Cluster profile and token settings."},{id:"fixture-b-cheapskate",label:"Cheapskate",body:"Model cost controls."}];for(let r of n)qn({id:r.id,label:r.label,icon:Y0,searchable:!0,searchPlaceholder:`Filter ${r.label} settings…`,order:r.id==="fixture-z-observability"?1:999,component:(i)=>l`<${C0} label=${r.label} body=${r.body} filter=${i?.filter||""} />`})}var xn={userName:"Rui Carmo",assistantName:"Smith",userAvatar:"",assistantAvatar:"",composeUploadLimitMb:32,workspaceUploadLimitMb:256,widgetToken:"piclaw_widget_fixture_token_0123456789abcdef",searchMatchMode:"or",instanceTotp:{configured:!0,issuer:"Piclaw Fixture",label:"Piclaw Fixture:Rui Carmo",secret:"JBSWY3DPEHPK3PXP",otpauth:"otpauth://totp/Piclaw%20Fixture:Rui%20Carmo?secret=JBSWY3DPEHPK3PXP&issuer=Piclaw%20Fixture",qrSvg:'<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><rect width="96" height="96" rx="10" fill="#fff"/><g fill="#111"><rect x="10" y="10" width="22" height="22"/><rect x="64" y="10" width="22" height="22"/><rect x="10" y="64" width="22" height="22"/><rect x="40" y="14" width="8" height="8"/><rect x="52" y="26" width="8" height="8"/><rect x="42" y="42" width="10" height="10"/><rect x="62" y="46" width="8" height="8"/><rect x="76" y="60" width="8" height="8"/><rect x="48" y="72" width="8" height="8"/></g></svg>'},providers:[{id:"openai",label:"OpenAI",authType:"api_key",configured:!0},{id:"anthropic",label:"Anthropic",authType:"api_key",configured:!1},{id:"github-copilot",label:"GitHub Copilot",authType:"oauth",configured:!0}],models:["openai/gpt-5.1","anthropic/claude-sonnet-4-5","github-copilot/gpt-5.4-mini"],model_options:[{label:"openai/gpt-5.1",provider:"openai",name:"GPT-5.1",context_window:200000,reasoning:!0},{label:"anthropic/claude-sonnet-4-5",provider:"anthropic",name:"Claude Sonnet 4.5",context_window:200000,reasoning:!0},{label:"github-copilot/gpt-5.4-mini",provider:"github-copilot",name:"GPT-5.4 mini",context_window:128000,reasoning:!1}],current:"openai/gpt-5.1",thinking_level:"medium",supports_thinking:!0,available_thinking_levels:["off","minimal","low","medium","high"],themes:[{id:"system",label:"System",dark:!1},{id:"ipad-pro",label:"iPad Pro",dark:!0},{id:"terminal",label:"Terminal",dark:!0}],colorKeys:["accent","background","surface","text"],toolsets:[{name:"core",description:"Core shell and file tools",tools:[{name:"read",kind:"read-only"},{name:"bash",kind:"mutating"}]},{name:"ui",description:"Web UI posting tools",tools:[{name:"send_dashboard_widget",kind:"mutating"},{name:"send_adaptive_card",kind:"mutating"}]},{name:"remote",description:"Infrastructure tools",tools:[{name:"ssh",kind:"mixed"},{name:"proxmox",kind:"mixed"},{name:"portainer",kind:"mixed"}]}]},J0={current:xn.current,models:xn.models,model_options:xn.model_options,thinking_level:xn.thinking_level,supports_thinking:xn.supports_thinking,available_thinking_levels:xn.available_thinking_levels},$u={sources:["fixture-catalog"],failed_sources:[],addons:[{slug:"cheapskate",name:"Cheapskate",description:"Model cost controls and routing hints.",installed:!0,enabled:!0,version:"0.1.0",bundled:!1},{slug:"observability",name:"Observability",description:"Local metrics and tracing panels.",installed:!0,enabled:!0,version:"0.2.0",bundled:!1},{slug:"portainer",name:"Portainer",description:"Container management add-on.",installed:!1,enabled:!1,version:"0.3.0",bundled:!1},{slug:"proxmox",name:"Proxmox",description:"Proxmox inventory and workflow add-on.",installed:!0,enabled:!1,version:"0.4.0",bundled:!1}]},wu={entries:[{name:"github/piclaw-bot-pat",type:"token",envVar:"GITHUB_PICLAW_BOT_PAT",updatedAt:new Date().toISOString(),userNote:"Fixture note",agentNote:"Use only through env injection."},{name:"ssh/relay.local",type:"secret",envVar:"SSH_RELAY_LOCAL",updatedAt:new Date().toISOString(),userNote:"",agentNote:""}]},en=new URLSearchParams(window.location.search).get("real")!=="1",tu=window.fetch.bind(window);function tn(n,r=200){return new Response(JSON.stringify(n),{status:r,headers:{"Content-Type":"application/json"}})}function E0(){window.fetch=async(n,r)=>{let i=new URL(typeof n==="string"?n:n.url,window.location.href),_=String(r?.method||"GET").toUpperCase();if(!en)return tu(n,r);if(i.pathname==="/agent/settings-data")return tn(xn);if(i.pathname==="/agent/models")return tn(J0);if(i.pathname==="/agent/addons")return tn($u);if(i.pathname.startsWith("/agent/addons/"))return tn({ok:!0,message:"Fixture add-on action accepted.",...$u});if(i.pathname==="/agent/keychain"){if(_==="GET")return tn(wu);if(_==="POST")return tn({ok:!0,...wu})}if(i.pathname==="/agent/settings/general")return tn({ok:!0,settings:xn});if(i.pathname==="/agent/settings/widget-token/regenerate")return tn({ok:!0,settings:{...xn,widgetToken:`piclaw_widget_fixture_regenerated_${Date.now()}`}});if(i.pathname.startsWith("/agent/default/message"))return tn({command:{status:"success",message:"Fixture command accepted."}});if(i.pathname.startsWith("/agent/settings/"))return tn({ok:!0,settings:xn,items:[],entries:[]});if(i.pathname==="/agent/client-perf")return tn({ok:!0});return tu(n,r)}}function d0(){let n=document.createElement("style");n.textContent=`
    html, body, #settings-widget-fixture-root { margin: 0; width: 100%; height: 100%; overflow: hidden; background: var(--bg-primary, #111827); color: var(--text-primary, #e5e7eb); }
    .settings-fixture-shell { height: 100vh; display: grid; grid-template-rows: auto minmax(0, 1fr); background: var(--bg-primary, #111827); }
    .settings-fixture-toolbar { position: relative; z-index: 2600; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 8px 10px; border-bottom: 1px solid var(--border-color, rgba(148,163,184,.22)); background: var(--bg-secondary, #0f172a); font: 12px var(--font-sans, system-ui, sans-serif); }
    .settings-fixture-toolbar strong { margin-right: 4px; }
    .settings-fixture-toolbar button, .settings-fixture-toolbar select, .settings-fixture-toolbar input { border: 1px solid var(--border-color, rgba(148,163,184,.28)); border-radius: 7px; background: var(--bg-primary, #111827); color: inherit; padding: 5px 8px; font: inherit; }
    .settings-fixture-toolbar input[type="range"] { padding: 0; width: 120px; }
    .settings-fixture-canvas { position: relative; min-height: 0; overflow: hidden; }
    .settings-fixture-canvas .settings-dialog-backdrop { position: absolute; inset: 0; background: color-mix(in srgb, var(--bg-primary, #111827) 82%, transparent); }
    .settings-fixture-canvas .settings-dialog { width: min(var(--fixture-width, 900px), 96vw); height: min(var(--fixture-height, 640px), 94%); max-width: none; max-height: none; }
    .settings-fixture-note { opacity: .72; }
  `,document.head.appendChild(n)}function yu(n){try{window.__piclawSettingsRequestedSection=n}catch(r){}window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:{section:n}}))}function S0(){let n=new URLSearchParams(window.location.search),[r,i]=w(n.get("section")||"general"),[_,c]=w(Number(n.get("width")||900)),[u,f]=w(Number(n.get("height")||640)),[o,s]=w(en),[$,b]=w(0),g=D(()=>["general","sessions","compaction","keyboard","workspace","environment","providers","models","theme","scheduled-tasks","quick-actions","keychain","tools","addons","fixture-b-cheapskate","fixture-z-observability","fixture-a-portainer","fixture-m-proxmox"],[]),p=T((v)=>{i(v),yu(v)},[]),h=T(()=>{en=!en,s(en),b((v)=>v+1)},[]);return l`
    <div class="settings-fixture-shell">
      <div class="settings-fixture-toolbar">
        <strong>Settings fixture</strong>
        <label>Section <select value=${r} onChange=${(v)=>p(v.target.value)}>${g.map((v)=>l`<option value=${v}>${v}</option>`)}</select></label>
        <label>Width <input type="range" min="480" max="1200" value=${_} onInput=${(v)=>c(Number(v.target.value))} /> ${_}px</label>
        <label>Height <input type="range" min="420" max="900" value=${u} onInput=${(v)=>f(Number(v.target.value))} /> ${u}px</label>
        <button type="button" onClick=${h}>${o?"Mock data":"Real endpoints"}</button>
        <button type="button" onClick=${()=>b((v)=>v+1)}>Remount</button>
        <span class="settings-fixture-note">Add-on panes are registered in scrambled order for nav ordering tests.</span>
      </div>
      <div class="settings-fixture-canvas" style=${`--fixture-width:${_}px;--fixture-height:${u}px;`}>
        <${Ir} key=${$} onClose=${()=>{}} />
      </div>
    </div>
  `}function e0(){O0(),E0(),d0();let n=new URLSearchParams(window.location.search);yu(n.get("section")||"general");let r=document.getElementById("settings-widget-fixture-root")||document.body.appendChild(document.createElement("div"));r.id="settings-widget-fixture-root",An(l`<${S0} />`,r),window.piclawWidget?.ready?.({title:"Settings fixture",mockMode:en})}e0();

//# debugId=10CEB2DDD360057E64756E2164756E21
//# sourceMappingURL=settings-widget-fixture.bundle.js.map
