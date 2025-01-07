<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.kangdainfo.common.util.*" %>
<%@ page import="com.kangdainfo.common.model.bo.*" %>
<%@ page import="com.kangdainfo.tbkn.model.bo.*" %>
<%@ page import="com.kangdainfo.tbkn.util.*" %>
<%@ page import="org.json.simple.*"%>
<%
	response.addHeader("Pragma", "No-cache");
	response.addHeader("Cache-Control", "no-cache");
	String ssoToken1 = Common.get(request.getParameter("ssoToken1"));//識別碼
	String callBackJavaScripMethodName = request.getParameter("callback");

	try {
		boolean isLogin = false;
		JSONObject json = new JSONObject();
		if (!"".equals(ssoToken1)) {
			CommonConfig commonConfig = (CommonConfig) View.getObject("from CommonConfig where id='10' ");
			if (commonConfig != null) {
				String wsdl = Common.get(commonConfig.getField1());
				if (!"".equals(wsdl)) {
					java.util.HashMap<String, String> reValue = TBKNCommon.getUserProfile(wsdl,ssoToken1);
					if (reValue != null) {
						String sso_user_id = Common.get(reValue.get(("USER_ID")));//帳號	
						Odaf15 user = (Odaf15) View.getObject("from Odaf15 where empNo=" + Common.sqlChar(sso_user_id) + " and coalesce(cancel,'')<>'Y' ");
						if (user != null) {
							json.put("ssoEmpNo", Common.get(user.getEmpNo()));
							json.put("ssoPswd", Common.get(user.getPswd()));
							json.put("ssoValid", "Y");
							isLogin = true;
						}
					}
				}
			}
		}
		if (!isLogin)
			json.put("ssoValid", "N");
		
		String jsonPoutput = callBackJavaScripMethodName + "("+ json.toString() + ");";
		out.write(jsonPoutput);
		
	} catch (Exception e) {
		e.printStackTrace();
	}
%>