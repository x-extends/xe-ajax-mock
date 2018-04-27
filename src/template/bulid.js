'use strict'

var tmplJoint = {
  tStart: '__restArr=[]',
  tEnd: "return __restArr.join('');",
  contStart: "__restArr.push('",
  contEnd: "');\n",
  contTrimEnd: "'.trim());\n",
  cStart: '__restArr.push(',
  cEnd: ');\n',
  simplifyRegExp: /__restArr\.push\('\s*'\);/g
}

function buildCode (code) {
  return tmplJoint.contEnd + code + tmplJoint.contStart
}

function buildTemplate (strTmpl, data) {
  var restTmpl = strTmpl
  .replace(/[\r\n\t]/g, ' ')
  .replace(/{{\s*(.*?)\s*}}/g, function (matching, code) {
    return buildCode(tmplJoint.cStart + code + tmplJoint.cEnd)
  })
  try {
    restTmpl = 'var ' + tmplJoint.tStart + ';with(opts){' + tmplJoint.contStart + restTmpl + tmplJoint.contEnd + '};' + tmplJoint.tEnd
    /* eslint-disable no-new-func */
    return new Function('opts', restTmpl.replace(tmplJoint.simplifyRegExp, ''))(data)
  } catch (e) {
    console.error(e)
  }
  return strTmpl
}

module.exports = buildTemplate
